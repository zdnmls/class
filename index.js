const fs = require('fs');
const path = require('path')
var mysql = require('mysql');
var session = require('express-session');
var express = require('express')
var app = express()
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db'
});
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}))
app.use(express.static('./public'));

// __dirname  当前文件所在的目录名
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');


app.get('/', (req, res) => {
    res.render('index', { name: req.session.name })
})
app.get('/login', (req, res) => {
    res.render('login')
})
app.get('/check', (req, res) => {
    const { name, password } = req.query;
    connection.query('select * from teacher where name=? and password=?', [name, password], function (error, results) {
        // console.log(results)
        if (error) throw error;
        if (results.length) {
            req.session.name = name;
            const sql = 'select * from classes';
            connection.query(sql, function (error, results) {
                if (error) throw error;
                res.render('class_list', { classes: results })
            })
        } else {
            res.render('login')
        }
    })
})
app.get('/class_list', (req, res) => {
    let sql = 'select * from classes';
    connection.query(sql, function (err, results) {
        // console.log(results);
        if (err) {
            res.send(err.message)
        }
        else {
            res.render('class_list', { classes: results })
        }
    }
    )
})
app.get('/class_detail', (req, res) => {
    let id = req.query.id
    // console.log(id);
    const sql = `select * from student where classe=${id}`;
    connection.query(sql, function (error, results) {
        if (error) throw error;
        res.render('class_detail', { student: results })
    })
})
app.get('/student_info', (req, res) => {
    const class_sql = 'select * from classes';
    const city_sql = 'select * from area where ParentCode=000000';
    connection.query(class_sql, function (error, classes) {
        connection.query(city_sql, function (error, city) {
            if (error) throw error;
            res.render('student_info', { classes: classes, city: city })
        })
    })
})
app.get('/add_student', (req, res) => {
    let { name, sex, hometown, expect_city, classe, seat } = req.query;
    connection.query('insert into student(name,sex,hometown,expect_city,classe,seat) values (?,?,?,?,?,?)', [name, sex, hometown, expect_city, classe, seat], function (error, results) {
        if (error) throw error;
        res.render('index');
    })
})
app.get('/gender_data', (req, res) => {
    let cid = req.query.cid;
    let sql = 'select * from student where classe =?';
    connection.query(sql, [cid], (err, results) => {
        if (err) throw err;
        res.json([
            { value: results.filter(v => v.sex === 1).length, name: '男生' },
            { value: results.filter(v => v.sex === 2).length, name: '女生' },
        ])
    })
})
app.get('/location_data', (req, res) => {
    // let cid = req.query.cid;
    // let a = 0;
    // let sql = 'select * from student where classe = ?';
    // connection.query(sql, [cid], (err, results) => {
    //     let r = [];
    //     let o = {};
    //     // console.log(results);
    //     results.forEach(v => {
    //         let key = v.hometown;
    //         if (!o[key]) {
    //             o[key] = [];
    //             a++;
    //         }
    //         o[key].push(v.name);
    //         // console.log(o)
    //     })
    //     for (let key in o) {
    //         const sql = `select * from area where RegionName like '${key}%'`;
    //         connection.query(sql, function (err, results) {
    //             // console.log(results)
    //             let j = '';
    //             let w = '';
    //             results.forEach(b => {
    //                 j = b.Longitude;
    //                 w = b.Latitude;
    //             })
    //             r.push({
    //                 name: key,
    //                 value: [
    //                     j,
    //                     w,
    //                     o[key].length
    //                 ]
    //             })
    //             // console.log(a);
    //             if (r.length == a) {
    //                 r[r.length] = 0.2
    //                 res.json(r)
    //             }
    //         })
    //     }
    // })

    let cid = req.query.cid;
    let sql = `select
        s.*,a.Longitude as lng, a.Latitude as lat
        from
        student as s ,area as a
        where
        s.hometown = a.Id
        and
        classe = ?`;
    let r = {};
    let arr = [];
    connection.query(sql, [cid], (err, results) => {
        results.forEach(v => {
            let key = v.lng + '-' + v.lat;
            if (!r[key]) {
                r[key] = []
            }
            r[key].push(v.name)
        })
        for (let v in r) {
            arr.push({
                "name": r[v].join('-'),
                "value": [
                    v.split('-')[0],
                    v.split('-')[1],
                    r[v].length
                ]
            })
        }
        // console.log(arr)
        arr[arr.length] = 0.5
        res.json(arr)
    })
})
app.get('/change_date', (req, res) => {
    let ParentCode = req.query.ParentCode;
    let sql = 'select * from area where ParentCode=?';
    connection.query(sql, [ParentCode], function (err, results) {
        res.json(results);
    })
})
app.get('/expect_city_data', (req, res) => {
    let cid = req.query.cid;
    let sql = 'select * from student where classe = ?';
    connection.query(sql, [cid], (err, results) => {
        let edges = [];
        let nodes = [];
        let colors = [
            '#ff7875',
            '#ff9c6e',
            '#95de64',
            '#5cdbd3',
            '#69c0ff',
            '#85a5ff',
            '#9254de'
        ];
        let i = 0;
        let j = 0;
        let o = {};
        results.forEach(v => {
            // console.log(v);
            if (!o[v.expect_city]) {
                nodes.push({
                    name: v.expect_city,
                    value: 12,
                    label: {
                        show: true
                    },
                    itemStyle: {
                        color: [colors[i % colors.length]]
                    }
                });
                i += 1;
                o[v.expect_city] = 1;
            }
            nodes.push({
                name: v.name,
                value: 3,
                label: {
                    show: true
                },
                itemStyle: {
                    color: '#000000'
                }
            });
            j += 1;
            edges.push({
                source: v.name,
                target: v.expect_city
            })
        });
        res.json({ edges, nodes })
    })
})
app.get('/seat_data', (req, res) => {
    let cid = req.query.cid;
    let sql = 'select * from student where classe =?';
    connection.query(sql, [cid], (err, results) => {
        // console.log(results);
        let s = {};
        results.forEach(v => {
            let t = JSON.parse(v.seat);
            s[[t.d, t.x, t.y].join('-')] = v.name
        });
        res.json(s);
    })
})
app.get('/card_data', (req, res) => {
    let cid = req.query.cid;
    let sql = 'select * from kecheng where cid =?';
    connection.query(sql, [cid], (err, results) => {
        let c = [];
        results.forEach(v => {
            c.push([
                v.times,
                v.kecheng
            ])
        })
        res.json(c)
    })
})
app.get('/salary_data', (req, res) => {
    let cid = req.query.cid;
    let sql = 'select * from student where classe = ?';
    connection.query(sql, [cid], (err, results) => {
        let edges = [];
        let nodes = [];
        let colors = [
            '#ff7875',
            '#ff9c6e',
            '#95de64',
            '#5cdbd3',
            '#69c0ff',
            '#85a5ff',
            '#9254de'
        ];
        let i = 0;
        let j = 0;
        let o = {};
        results.forEach(v => {
            // console.log(v);
            if (!o[v.expect_city]) {
                nodes.push({
                    name: v.expect_city,
                    value: 12,
                    label: {
                        show: true
                    },
                    itemStyle: {
                        color: [colors[i % colors.length]]
                    }
                });
                i += 1;
                o[v.expect_city] = 1;
            }
            nodes.push({
                name: v.name,
                value: 3,
                label: {
                    show: true
                },
                itemStyle: {
                    color: '#000000'
                }
            });
            j += 1;
            edges.push({
                source: v.name,
                target: v.expect_city
            })
        });
        res.json({ edges, nodes })
    })
})
app.listen(3000)






