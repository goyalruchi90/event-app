
var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');

var app = express();

app.set('port', process.env.PORT || 5000);

app.use(express.static('public'));
app.use(bodyParser.json());
app.get('/selectEvent', function(req, res) {

    pg.connect(process.env.DATABASE_URL, function(err, conn, done) {
        // watch for any connect issues
        if (err) console.log(err);
        conn.query(
            'SELECT * from salesforce.Events__c',
            function(err, result) {
                if (err != null || result.rowCount == 0) {
                    console.log("no data to display. Error is"+err);
                } else {
                    done();
                    console.log("result is " + res);
                    res.json(result);
                }
            }
        );
    });
});

app.post('/selectSessions', function(req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, conn, done) {
        // watch for any connect issues
        if (err) console.log(err);
        conn.query(
            'SELECT  * from salesforce.Sessions__c WHERE Events__c IN (SELECT sfid from salesforce.Events__c where id=$1)', [req.body.event_id.trim()],
            function(err, result) {
                if (err != null || result.rowCount == 0) {
                    //console.log("error is "+err);
                    console.log("no session to display");
                    done();
                    res.json(result);
                } else {
                    done();
                    res.json(result);
                }
            }
        );
    });
});
app.post('/registerAttendee', function(req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, conn, done) {
        // watch for any connect issues
        if (err) console.log(err);
        conn.query(
            'INSERT INTO salesforce.Attendees__c (Name, Last_Name__c, Email__c, Phone__c, Company__c,Events__c,Sessions__c) VALUES ($1,$2, $3, $4, $5, $6,$7)', [req.body.first_name.trim(), req.body.last_name.trim(), req.body.emai_id.trim(), req.body.phone.trim(), req.body.company.trim(), req.body.event.trim(),req.body.session.trim()],
            function(err, result) {
                if (err != null || result.rowCount == 0) {
                    conn.query(
                        'SELECT * from salesforce.Attendees__c where Email__c like $1', [req.body.emai_id.trim()],
                        function(err, result) {
                            if (err != null || result.rowCount == 0) {
                                console.log("error in select Attendees__c " + err);
                            } else {
                                conn.query(
                                    'SELECT * from salesforce.Event_Association__c where Events__c like $1 AND Attendees__c like $2 AND Sessions__c like $3', [req.body.event.trim(), result.rows[0].sfid, req.body.session.trim()],
                                    
                                    function(err, EAresult) {
                                        console.log("err in getting EA"+err);
                                        
                                        console.log("EA select result is "+JSON.stringify(EAresult));
                                        if (err != null || EAresult.rowCount == 0) {
                                             conn.query(
                                    'INSERT INTO salesforce.Event_Association__c (Events__c,Attendees__c, Sessions__c) VALUES ($1,$2,$3)', [req.body.event.trim(), result.rows[0].sfid, req.body.session.trim()],
                                    function(err, result) {
                                        console.log();
                                        console.log("EA  error is "+err);
                                        console.log("EA result is "+JSON.stringify(result.rows));
                                        if (err != null || result.rowCount == 0) {
                                            console.log("error in insert  Event_Association__c " + err);
                                        } else {
                                            done();
                                            res.json(result);
                                        }
                                    }
                                );
                                        } else {
                                            done();
                                          res.json({message:"Already Registered"});
                                            console.log("Already Registered!!");
                                        }
                                    }
                                );
                               
                            }
                        }
                    );
                } else {
                    done();
                    res.json(result);
                }
            }
        );
    });
});
app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});