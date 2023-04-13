import Mock from "mockjs";
import moment from 'moment';
var nowDate = moment(moment().format('YYYY-MM-DD 00:00:00')).valueOf()
let weekOfDay = parseInt(moment().format('E'));//计算今天是这周第几天
let last_monday = moment().startOf('day').subtract(weekOfDay - 1, 'days').toDate();//周一日期
let last_sunday =  moment().startOf('day').subtract(weekOfDay - 7, 'days').toDate();//周日日期
console.log(nowDate, last_monday, last_sunday)

var Random = Mock.Random;

// example 相关
Mock.mock("/api/getCourseList", function () {
  console.log(Random.integer(1, 3))
  return Mock.mock({
    status: "200",
    errorcode: 0,
    errordesc: null,
    schoolstarttime: 0,
    schoolendtime: 52200000,
    timeScope: [
      {
        "weekday": "1,2,3,4,5,6,7",
        "startTime": 0,
        "endTime": 52200000
      }
    ],
    "courselist|10": [
      {
        "courseID|+1": 1100568,
        "type": null,
        "studentCourseID": null,
        "classRoomID": 10269,
        "teacherID": null,
        "campusName": "(1)广州校区",
        "courseType|1-3": 1,
        "courseName": Random.word(4,6),
        "className": null,
        "classRoomName": "教室1",
        "number": null,
        "appointmentNum": 0,
        "sameClassTypeStudentNumber": null,
        "classStudentNumber": null,
        "startTime|+90000000": 1681085700000,
        "endTime|+90000000": 1681087500000,
        "student": Random.cname(),
        "teacher": null,
        "classStatus": null,
        "status": 1,
        "teachType": 0,
        "classLevelConfigName": "",
        "classID": null,
        "courseAttenceStatus": "请假不扣课时",
        "teacherReviewContent": null,
        "teacherStarNum": null,
        "studentReviewContent": null,
        "studentStarNum": null,
        "reviewHomework": -2,
        "advanceAttence": true,
        "arrangeCourseType": 3,
        "arrangeCourseType2": 3,
        "tryClassStudentNum": 0,
        "classType": 0,
        "appointType": 0,
        "campusID": 114522,
        "createTime": 1646729048000,
        "color": 2,
        "tipInfo": "学生学生40已请假",
        "wordFlag": "2",
        "todayLastTime": 1677167999513,
        "nowTime": Date.now(),
        "overlay": null,
        "overlayNum": null,
        "studentID": 406299,
        "tutornames": null,
        "tutorIDs": null,
        "attendanceType": null,
        "studentcode": "stu00037",
        "bindphone": "15912340040",
        "nodenum": null,
        "classRoomCategory": "类别1",
        "classHours": "30",
        "studentRemark": "",
        "classRemark": null,
        "attendanceStatus": 2,
        "teacherCode": null,
        "classroomCode": null,
        "exportContent": null,
        "teacherLevelName": null,
        "studentLevelName": null,
        "canDelete": 1,
        "studentPracticeID": 2209,
        "count": null,
        "courseContext": "22343",
        "courseContextURL": null,
        "courseContextStatus": null,
        "notattence": 0,
        "chargetype": null,
        "courseStudentAttendanceStat": null,
        "classRoomCategoryID": 1927,
        "classRoomCategoryIDStr": "1927",
        "isConflict": 0,
        "courseConfigID": null
      },
    ],
    "teachingtimelist": null,
    "schoollisttime": null,
    "teachersTeachingTimes": null,
    "teacherIsOpenRule": 1,
    "roomIsOpenRule": 1,
    "teacherRoomTimeList": null,
    "roomTeacheTimeList": null,
    "teacherInfo": null,
    "teacherInfos": null,
    "classRoomName": null,
    "classRoomCode": null,
    "resultlist": [],
    "countCourses": 61,
    "notAttend": 30,
    "datetime": Date.now(),
    "isOpenRule": 1
  });
});
