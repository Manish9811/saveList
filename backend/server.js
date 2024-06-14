const express = require('express');
const database = require('./Database');
const app =express();
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');

app.use(cors({
    origin: ['https://todoapp-plum-five.vercel.app]
    credentials: true
}))


app.use(bodyParser.json());


app.get('/', (req,res) => {
    return res.json({
        msg : "all good"
    })
})

app.post('/addTodo',(req,res) => {
    
    const {task} = req.body;
    
    database.ref('toDo/').push({
        userTask : task
    }).then((result)=>{
        return res.json({
            message : "Task Added Successfully"
        })
    }).catch((err) => {
        console.log(err)
        return res.json({
            message : "Task Add Failed"
        })
    })
})

app.get('/getAllTask', (req,res )=> {
    database.ref('toDo/').once('value').then((value) => {
        const tasks = [];
        if(value.exists()){
           value.forEach((value) => {
            const key = value.key;
            const data = value.val();

            tasks.push({id : key, ...data})
           })

           return res.json({
            tasks
           })
        }
        else{
            return res.json({
                message : "No Task Found"
            })
        }
    })
})

app.delete('/deleteData' , (req,res) => {
    const {id} = req.body;

    console.log(id)
    database.ref('toDo/' + id).remove().then(() => {
        return res.json({
            message : "Deleted Successfully"
        })
        
    }).catch(() => {
        res.json({
            message : "Deleted Unsuccess"
        })
        })
})

app.post('/users', (req,res) => {
    const {UserId, UserName,LastName} = req.body;

    database.ref('users/' + UserId).set({
        UserName: UserName,
        LastName: LastName
    }).then((res) => {
        res.json(res)
    }).catch((err) => {res.json(err)})
})


app.get('/getAllData/:userId' , (req,res) => {
    const userId = req.params.userId;

    database.ref('users/' + userId).once('value').then((value)=>{
        if(value.exists()){
            // console.log(value.length)
            return res.json(value.val());
        }
        else{
            return res.json({
                msg:"No Data found"
            })
        }
    }).catch((err) =>{
        res.json({
            msg:err.message
        })
    })
})


app.post('/updateDetails/:userId', (req,res) => {
    const userId = req.params.userId;
    console.log(userId)
    const {updatedName} = req.body;

    database.ref('users/' + userId).once('value').then((value) => {
        if(value.exists()){
            console.log(value.val())
            database.ref('users/'+userId).update({
                UserName : updatedName
            }).then(()=>{
                return res.json({
                    msg:"Name updated"
                })
            }).catch((er)=>{
                return res.json({
                    msg:"Name updated unsuccess " + er.message
                })
            })
        }
        else{
           return res.json({
                msg:"Id Cannot found"
            })
        }
    }).catch((err) => {
        return res.json({
            'message' : err.message
        })
    })

})

app.get('/home', (req,res) => {
    res.json({
        data:"hello"
    })
})

app.listen((4000) , () => {
    console.log(`App is running ln port 4000`)
})
