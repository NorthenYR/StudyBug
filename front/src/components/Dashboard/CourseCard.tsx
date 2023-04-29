import Box from "@mui/material/Box";
import { Card, Typography, Stack } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Task } from "../../models/course";
import * as TasksApi from "../../network/tasks_api";
import dayjs from 'dayjs';

const CourseCard = ({title,bgcolor,courses,tasks}:{title:string,bgcolor:string,courses:any, tasks:any}) => {

    const [average, setAverage] = useState(0)
    const [earliestDeadline, setEarliestDeadline] = useState(new Date())
    const [assignType, setAssignType] = useState("")
    const [taskDetails, setTaskDetails] = useState({} as Task);

    /*
    const getTask = async (myTask: Task) => {
        let t = await TasksApi.getTask("6434bb5366ea8cc1b9bb9e17");
        setTaskDetails(t);
      };
    */
    useEffect(() => {
        const getAvg = () => {
            var weight = 0;
            var credit = 0;
            var earliest = new Date("9999-02-08T23:55:15.051Z");
            var early = dayjs(earliest)
            var assiType = ""
            courses.forEach((course:any) => {
                console.log(course)
                if (course['code'] === title) {
                    course['tasks'].forEach((task:any) => {
                        tasks.forEach((t:Task) => {
                            if ( t._id == task){
                                credit += t['earned']
                                weight += t['weight']
                                var tempDate = t['end_date']
                                if (dayjs(tempDate) < early){
                                    early = dayjs(tempDate)
                                    assiType = t['variety']
                                    console.log(early)
                                }
                            }
                        })
                    })
                }
            }
            )
            setAverage(Math.round(((credit/weight) + Number.EPSILON) * 100) / 100)
            setEarliestDeadline(early.toDate())
            setAssignType(assiType)
            console.log(assiType)
        }
        getAvg()
    },[])



    return (
        <Card variant="outlined" sx={{
            boxShadow: 1,
            borderRadius: 20,
            p:3,
            height: "25vh",
            width: '10%',
            justifyContent: "center",
            alignItems: "center",
            bgcolor: bgcolor,
            marginRight: 1
            }} >
                <Typography variant="h3" align="center" sx={{fontWeight:'bold', py:'1vh'}}>{title}</Typography>
                <Typography variant="h2" align="center" sx={{fontWeight:'bold', py:'2vh'}}>{average*100}%</Typography>
                <Stack direction="row" justifyContent = "center" alignItems = "center">
                <Stack direction="column" marginX={"5%"} justifyContent = "center" alignItems = "center" spacing={0}>
                <Typography variant="body2" align="center" sx={{fontWeight:'bold'}}>{earliestDeadline.toLocaleString('default', {month: 'short'})}</Typography>
                <Typography variant="body2" align="center" sx={{fontWeight:'bold'}}>{earliestDeadline.toLocaleString('default', {day: 'numeric'})}</Typography>
                </Stack>
                <Stack direction="column" marginX={"10%"} justifyContent = "start" alignItems = "start" spacing={0}>
                <Typography variant="body1" align="center" sx={{fontWeight:'bold'}}>{earliestDeadline.toLocaleString('default', {hour: 'numeric', minute: "numeric", hour12: true})}</Typography>
                <Typography variant="body1" align="center" sx={{fontWeight:'bold'}}>{assignType}</Typography>
                </Stack>
                </Stack>
        </Card>
      );
          }
          
export default CourseCard;
