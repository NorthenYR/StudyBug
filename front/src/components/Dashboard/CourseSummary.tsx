import Box from '@mui/material/Box';
import { Card, Stack } from "@mui/material";
import CourseCard from './CourseCard';
import React, { useState, useEffect } from "react";


const CourseSummary = ({courses,tasks}:{courses:any, tasks:any}) => {

    return (
        <Card sx={{
            border: "none",
            boxShadow: "none",
            p:3,
            mx:10,
            }} >
                <Stack direction="row">
                    {
                        courses.map((course:any) => (
                            <CourseCard title={course['code']} bgcolor={course['color']} courses={courses} tasks={tasks}/>
                        ))
                    }
                    <>{console.log(courses)}</>
                </Stack>
        </Card>
      );

}

export default CourseSummary