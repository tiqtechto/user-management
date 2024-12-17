const mongoose = require('mongoose');
const Book = require("../models/Books");
const BookAsset = require("../models/BookAssets");

const getSingleBook = async (req, res) => {
    let response;

    try{
        let bookid = req.query.bookid;

        let aggregate = [
            {
                // Match stage to filter by bookid
                $match: {
                  bookid: mongoose.Types.ObjectId(bookid) // Ensure `bookid` is an ObjectId
                },
            },
            {
                $lookup: {
                  from: 'BookAssets',
                  localField: '_id',
                  foreignField: 'bookid',
                  as: 'files',
                },
              },
              {
                  $addFields:{
                      'Books.title': '$title',
                      'files.id': '$files._id',
                      'files.fileimage': '$files.filedata64',
                      'files.datetime': '$files.createdAt',
                  }
              },
              {
                $project: {
                  createdAt: 0,
                  updatedAt: 0,
                  __v: 0,
                  'files._id': 0,
                  'files.createdAt': 0,
                  'files.updatedAt': 0,
                  'files.userid': 0,
                  'files.bookid': 0,
                  'files.__v': 0,
                  'files.filedata64': 0,
                },
              }         
        ]; 

        const dbbook = await Book.aggregate(aggregate);
        if(dbbook){
            let book = []; 

            dbbook.forEach((val, index) => {
                let id = val._id;
                let bookid = val.bookid;
                let title = val.title;
                let author = val.author; 
                
                book.push({id: id, bookid: bookid, title: title, author: author, files: val.files});
            });

            response = {
                status: 200,
                type: 'success',
                data: book
            };
        } else {
            response = {
                status: 500,
                type: 'error',
                msg: 'Something went wrong'
            }
        }
        
    }
    catch(error){
        response = {
            status: 500,
            type: 'error',
            msg: error.message || 'Something went wrong'
        }
    }

};

const getBooklist = async (req, res) => { 
    let response;
    
    try{
        const search = req.query.search;
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit === 'all' ? 0 : parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let aggregate = [
            { $skip: skip },
            {
                $lookup: {
                  from: 'BookAssets',
                  localField: '_id',
                  foreignField: 'bookid',
                  as: 'files',
                },
              },
              {
                  $addFields:{
                      'Books.title': '$title',
                      'files.id': '$files._id',
                      'files.fileimage': '$files.filedata64',
                      'files.datetime': '$files.createdAt',
                  }
              },
              {
                $project: {
                  createdAt: 0,
                  updatedAt: 0,
                  __v: 0,
                  'files._id': 0,
                  'files.createdAt': 0,
                  'files.updatedAt': 0,
                  'files.userid': 0,
                  'files.bookid': 0,
                  'files.__v': 0,
                  'files.filedata64': 0,
                },
              }         
        ];

        if (limit > 0) {
            aggregate.push({ $limit: limit });
        }
        if (typeof search != 'undefined' && search.length != 0 && search != '') {
            aggregate.push({
                $match: {
                    $or: [
                      { title: { $regex: search, $options: 'i' } }, // Case-insensitive search on title
                 ]
                }
             });
        }
        const dbevents = await Book.aggregate(aggregate);
        
        if(dbevents){
            let events = [];

            const pagetotal = await Book.countDocuments({});
            
            dbevents.forEach((val, index) => {
                let id = val._id;
                let bookid = val.bookid;
                let title = val.title;
                let author = val.author; 
                
                events.push({id: id, bookid: bookid, title: title, author: author, _children: val.files});
            });

            response = {
                status: 200,
                type: 'success',
                data: events,
                pageTotal: Math.round(pagetotal / 10)
            };

        } else {
            response = {
                status: 500,
                type: 'error',
                msg: 'Something went wrong'
            }
        }
    }
    catch(error){
        response = {
            status: 500,
            type: 'error',
            msg: error.message || 'Something went wrong'
        }
    }
    
    return res.json(response);
}; 

const addUpdateBook = async (req, res) => {
    let response;

    try{
        const { bookid, title, author, bookFile } = req.body;
        const bookId = req.body.id;

        let book;
        if (bookId) {
            book = await Book.findByIdAndUpdate(
                bookId,
                { bookid, title, author },
                { upsert: true }
            );
            
            let message = () =>{
                if(typeof bookFile != 'undefined' && bookFile != null && bookFile.length != 0){
                    return 'Book updated with file';
                } else {
                    return 'Book updated';
                }
            };

            if(book){
                response = {
                    status: 200,
                    type: 'success',
                    date: startdate,
                    msg: message()
                }
            } else {
                response = {
                    status: 500,
                    type: 'error',
                    msg: 'Something went wrong'
                }
            }
        } else {
            book = new Book({});
            book.bookid = bookid;
            book.userid = req.user.id;
            book.title = title;
            book.author = author;
            
            const savedBook = await book.save();

            if(savedBook){
                response = {
                    status: 200,
                    type: 'success',
                    msg: 'Book added'
                }
            } else {
                response = {
                    status: 500,
                    type: 'error',
                    msg: 'Something went wrong'
                }
            }

        }

        /* files save */
        if(typeof bookFile != 'undefined' && bookFile.length > 0){ 
            const saveTransac = await mongoose.startSession();
            bookFile.forEach(async function(file, index){ 
                await saveTransac.startTransaction();
                try{
                    const newBookFile = new BookAsset({
                        filename: file.filename,
                        filetype: file.filetype,
                        filesize: file.filesize,
                        filedata64: file.fileimage,
                        userid: req.user.id,
                        bookid: book.bookid,
                        createdAt: file.datetime
                    });

                    const saveEventFile = await newBookFile.save();

                    if(saveEventFile){ 
                        await saveTransac.commitTransaction();
                        response = {
                            status: 200,
                            type: 'success',
                            date: startdate,
                            msg: 'Book added to calendar with files'
                        }
                    } else {
                        await saveTransac.abortTransaction();
                        response = {
                            status: 500,
                            type: 'error',
                            msg: 'Something went wrong'
                        }
                    }
                } catch(error){
                    response = {
                        status: 500,
                        type: 'error',
                        msg: error.message || 'Something went wrong'
                    }
                }
            });
            saveTransac.endSession();
        }
        /* files save */
    }
    catch(error){
        response = {
            status: 500,
            type: 'error',
            msg: error.message || 'Something went wrong'
        }
    }

    return res.json(response);
}

const deleteBookFile = async (req, res) => {
    let response;
    try{
        let fileid = req.body.id;
        if(fileid){
            const deletedEventFile = await BookAsset.findOneAndDelete({ _id: fileid });
            
            if(deletedEventFile){
                response = {
                    status: 200,
                    type: 'success',
                    msg: 'Book file deleted'
                }
            } else {
                response = {
                    status: 404,
                    type: 'error',
                    msg: 'Book file not found'
                }
            }
        } else {
            response = {
                status: 500,
                type: 'error',
                msg: 'Something went wrong'
            }
        }
    }
    catch(error){
        response = {
            status: 500,
            type: 'error',
            msg: error.message || 'Something went wrong'
        }
    }

    return res.json(response);
}

const deleteBook = async (req, res) =>{
    let response;

    try{
        let bookid = req.body.id;

        const book = await Book.findOneAndDelete({_id: bookid});

        if(book){
            const deletedEventFile = await BookAsset.findOneAndDelete({ bookid: book.bookid });
            if(deletedEventFile){
                response = {
                    status: 200,
                    type: 'success',
                    msg: 'Book deleted with files'
                }
            } else{
                response = {
                    status: 200,
                    type: 'success',
                    msg: 'Book deleted'
                }
            }
        } else {
            response = {
                status: 500,
                type: 'error',
                msg: 'Something went wrong'
            }
        }

    } catch(error){
        response = {
            status: 500,
            type: 'error',
            msg: error.message || 'Something went wrong'
        }
    }

    return res.json(response);
}

module.exports = {
    addUpdateBook,
    deleteBook,
    deleteBookFile,
    getBooklist,
    getSingleBook
};