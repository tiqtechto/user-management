const User = require("../models/User");

const home = async (req, res) =>{
    let response = {
        status: 400,
        msg: 'home'
    };
    res.json(response);
}

/* pagination example tabulator */
const getEventlist = async (req, res) => { 
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
                  from: 'eventfiles',
                  localField: '_id',
                  foreignField: 'eventid',
                  as: 'files',
                },
              },
              {
                  $addFields:{
                      'events.title': '$description',
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
                  'files.eventid': 0,
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
                      { description: { $regex: search, $options: 'i' } }, // Case-insensitive search on description
                 ]
                }
             });
        }
        const dbevents = await Event.aggregate(aggregate);
        
        if(dbevents){
            let events = [];

            const pagetotal = await Event.countDocuments({});
            
            dbevents.forEach((val, index) => {
                let id = val._id;
                let title = val.title;
                let allday = val.allday; 
                let description = val.description;

                if(val.start != null && val.end != null){
                    let startDate = moment(new Date(val.startdate)).format('YYYY-MM-DD');
                    let endDate = moment(new Date(val.enddate)).format('YYYY-MM-DD');
                    let momStart = moment(startDate+' '+val.start, 'YYYY-MM-DD h:mm A').toISOString();
                    let momEnd = moment(endDate+' '+val.end, 'YYYY-MM-DD h:mm A').toISOString();
                    var start = momStart;
                    var end = momEnd;

                    var starttime = val.start;
                    var endtime = val.end;
                } else {
                    let momStart = moment(val.startdate).format('YYYY-MM-DDTHH:mm:ssZ');
                    let momEnd = moment(val.enddate).format('YYYY-MM-DDTHH:mm:ssZ');
                    var start = momStart;
                    var end = momEnd;
                    var starttime = null;
                    var endtime = null;
                }
                
                events.push({id: id, title: title, allDay: allday, start: start, end: end, starttime: starttime, endtime: endtime, _children: val.files});
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
    console.log('this is event ==',response);
    return res.json(response);
};
/* pagination example tabulator */

module.exports = {
    home
};

