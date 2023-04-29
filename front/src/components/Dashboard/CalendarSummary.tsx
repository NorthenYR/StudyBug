import { Calendar, momentLocalizer, SlotInfo } from "react-big-calendar";
import moment from "moment";
import Box from '@mui/material/Box';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Card } from "@mui/material";
import React, { useState, useEffect } from "react";
import * as CoursesApi from "../../network/courses_api"
import * as TasksApi from "../../network/tasks_api"
import { Course as CourseModel } from "../../models/course";
import { Task as TaskModel } from "../../models/course";
import dayjs from "dayjs";




moment.locale("en-US");
const localizer = momentLocalizer(moment);

const CalendarSummary = ({courses,tasks, formatTasks}:{courses:any, tasks:any, formatTasks:any}) => {
  console.log(tasks)
  console.log(formatTasks)

    return (
			<Card
				variant='outlined'
				sx={{
					boxShadow: 1,
					borderRadius: 20,
					p: 6,
					pb: 6,
					mx: 10,
					mb: 4,
					bgcolor: 'background.paper',
				}}>
				<Box>
					<Calendar
						views={['week']}
						localizer={localizer}
						defaultDate={new Date()}
						toolbar={false}
						defaultView='week'
						step={180}
						events={formatTasks}
						style={{ height: '25vh' }}
						titleAccessor={'name'}
						startAccessor={'start_date'}
						endAccessor={'end_date'}
						resourceIdAccessor={'_id'}
					/>
				</Box>
			</Card>
		);

}

export default CalendarSummary