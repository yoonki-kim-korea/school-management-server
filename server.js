const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended : true}));

console.log(`app=${app}`);

const port = process.env.PORT || 5000;
const fs = require('fs');
const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host : conf.host,
    user : conf.user,
    password : conf.password,
    port : conf.port,
    database : conf.database,
    multipleStatements : true
});
connection.connect();
app.listen(port, () => console.log(`Listening on port ${port}`));


const multer = require('multer');
const upload = multer({dest : './upload'});
app.use('/image', express.static('./upload'));

//------------------------------------------------------------------------------------------

/**
 * paradox 과거 데이터
 */
const paradox = require('./legacy/paradox.js');
app.get('/api/paradox/list', (req,res) => { paradox.legacyList(req, res, connection)});

/**
 * 로그인 검사
 */
const auth = require('./system/auth.js');
app.get('/auth/login/check', (req,res) => { auth.userList(req, res, connection)});

/**
 * 사용자
 */
//사용자 목록
const user1 = require('./user/list.js');
app.get('/api/user/list', (req,res) => { user1.userList(req, res, connection)});

//사용자 ID 유효성 검사
const user2 = require('./user/save.js');
app.get('/api/user/valid', (req,res) => { user2.checkValidUserId(req, res, connection)});

//사용자 저장
app.post('/api/user/save', upload.single('image'), (req, res) => { user2.saveUser(req, res, connection)});

//사용자 수정
const user3 = require('./user/update.js');
app.post('/api/user/update', upload.single('image'), (req, res) => { user3.updateUser(req, res, connection)});

//사용자 삭제
const user4 = require('./user/delete.js');
app.post('/api/user/delete', upload.single('image'), (req, res) => { user4.deleteUser(req, res, connection)});

/**
 * 메모
 */
//메모 목록
const diary1 = require('./diary/list.js');
app.get('/api/diary/list', (req,res) => { diary1.diaryList(req, res, connection)});

//메모 저장
const diary2 = require('./diary/save.js');
app.post('/api/diary/save', upload.single('image'), (req, res) => { diary2.saveDiary(req, res, connection)});

//메모 수정
const diary3 = require('./diary/update.js');
app.post('/api/diary/update', upload.single('image'), (req, res) => { diary3.updateDiary(req, res, connection)});

//메모 삭제
const diary4 = require('./diary/delete.js');
app.post('/api/diary/delete', upload.single('image'), (req, res) => { diary4.deleteDiary(req, res, connection)});

/*********************************************************************************************
 * 학급관리
 *******************************************************************************************/
//운영학급 관리
const operclassList = require('./operclass/list.js');
//운영학급 목록 조회
app.get('/api/operclass/list', (req,res) => { operclassList.classbookList(req, res, connection)});
app.get('/api/operclass/excel/list', (req,res) => { operclassList.classbookExcelList(req, res, connection)});
app.get('/api/operclass/address/list', (req,res) => { operclassList.addresslist(req, res, connection)});
//운영중인 반 학생 목록
app.get('/api/operclass/management/list', (req,res) => { operclassList.operStudentList(req, res, connection)});

//운영학급관리 수정
const operclassUpdate = require('./operclass/update.js');
//학급별 학생정보 중 수료여부, 감면사유 수정
app.post('/api/operclass/student/update', upload.single('image'), (req, res) => { operclassUpdate.updateStudent(req, res, connection)});

//휴학처리
app.post('/api/operclass/student/leave/update', upload.single('image'), (req, res) => { operclassUpdate.leaveStudent(req, res, connection)});

//수강중단
app.post('/api/operclass/student/abandon/update', upload.single('image'), (req, res) => { operclassUpdate.abandonClass(req, res, connection)});

//복학
app.post('/api/operclass/student/return/update', upload.single('image'), (req, res) => { operclassUpdate.returnStudent(req, res, connection)});

//졸업
app.post('/api/operclass/student/graduate/update', upload.single('image'), (req, res) => { operclassUpdate.graduateStudent(req, res, connection)});

//다른 반으로 이동
app.post('/api/operclass/student/trade/update', upload.single('image'), (req, res) => { operclassUpdate.tradeStudent(req, res, connection)});

//전입
app.post('/api/operclass/student/register/update', upload.single('image'), (req, res) => { operclassUpdate.insertStudent(req, res, connection)});

/**
 * 운영학급관리 엑셀변환
 */
const excelAll = require('./excel/all.js');
//전체 출석부, 주소록 변환
app.post('/api/operclass/excel', upload.single('image'), (req, res) => { excelAll.makeExcel(req, res)});

//출석부 엑셀변환
const excelClassbook = require('./excel/classbook.js');
app.post('/api/print/excel/classbook', upload.single('image'), (req, res) => { excelClassbook.makeExcel(req, res)});

//주소록 엑셀변환
const excelAddress = require('./excel/address.js');
app.post('/api/print/excel/address', upload.single('image'), (req, res) => { excelAddress.makeExcel(req, res)});

/**
 * 종료학급관리
 */
const endclassList = require('./endclass/list.js');
app.get('/api/endclass/list', (req,res) => { endclassList.endclassList(req, res, connection)});

/*********************************************************************************************
 * 학급
 *******************************************************************************************/
//학급 목록
const classinfoList = require('./classifno/list.js');
app.get('/api/classinfo/list', (req,res) => { classinfoList.classinfoList(req, res, connection)});
app.get('/api/classinfo/candidate/list', (req,res) => { classinfoList.candidateList(req, res, connection)});
app.get('/api/classinfo/assign/list', (req,res) => { classinfoList.assignList(req, res, connection)});
app.get('/api/classinfo/dupl/list', (req,res) => { classinfoList.classinfoDuplCheckList(req, res, connection)});

//학급 저장
const classinfoSave = require('./classifno/save.js');
app.post('/api/classinfo/save', upload.single('image'), (req, res) => { classinfoSave.saveClassinfo(req, res, connection)});

//학생배정 저장
app.post('/api/classinfo/assigned/save', upload.single('image'), (req, res) => { classinfoSave.saveAssigned(req, res, connection)});

//학급 수정
const classinfoUpdate = require('./classifno/update.js');
app.post('/api/classinfo/update', upload.single('image'), (req, res) => { classinfoUpdate.updateClassinfo(req, res, connection)});

//폐강
app.post('/api/classinfo/cancel', upload.single('image'), (req, res) => { classinfoUpdate.cancelClassinfo(req, res, connection)});

//종강
app.post('/api/classinfo/end', upload.single('image'), (req, res) => { classinfoUpdate.endClassinfo(req, res, connection)});

//반확정-운영시작
app.post('/api/classinfo/determine', upload.single('image'), (req, res) => { classinfoUpdate.determineClassinfo(req, res, connection)});

//학급 삭제
const classinfoDelete = require('./classifno/delete.js');
app.post('/api/classinfo/delete', upload.single('image'), (req, res) => { classinfoDelete.deleteClassinfo(req, res, connection)});

/*********************************************************************************************
 * 교실
 *******************************************************************************************/
//교실 목록
const classroomList = require('./classroom/list.js');
app.get('/api/classroom/list', (req,res) => { classroomList.classroomList(req, res, connection)});

//교실 저장
const classroomSave = require('./classroom/save.js');
app.post('/api/classroom/save', upload.single('image'), (req, res) => { classroomSave.saveClassroom(req, res, connection)});

//교실 수정
const classroomUpdate = require('./classroom/update.js');
app.post('/api/classroom/update', upload.single('image'), (req, res) => { classroomUpdate.updateClassroom(req, res, connection)});

//교실 삭제
const classroomDelete = require('./classroom/delete.js');
app.post('/api/classroom/delete', upload.single('image'), (req, res) => { classroomDelete.deleteClassroom(req, res, connection)});

/*********************************************************************************************
 * 학기
 *******************************************************************************************/
//학기 목록
const semesterList = require('./semester/list.js');
app.get('/api/semester/list', (req,res) => { semesterList.semesterList(req, res, connection)});

//학기 등록가능여부
app.get('/api/semester/save/valid', (req,res) => { semesterList.semesterSaveValid(req, res, connection)});

//학기 삭제가능여부
app.get('/api/semester/delete/valid', (req,res) => { semesterList.semesterDeleteValid(req, res, connection)});

//학기 저장
const semesterSave = require('./semester/save.js');
app.post('/api/semester/save', upload.single('image'), (req, res) => { semesterSave.saveSemester(req, res, connection)});

//학기 저장
const semesterUpdate = require('./semester/update.js');
app.post('/api/semester/update', upload.single('image'), (req, res) => { semesterUpdate.updateSemester(req, res, connection)});

//학기 저장
const semesterDelete = require('./semester/delete.js');
app.post('/api/semester/delete', upload.single('image'), (req, res) => { semesterDelete.deleteSemester(req, res, connection)});

/*********************************************************************************************
 * 공통코드
 *******************************************************************************************/
//공통코드 목록
const code = require('./code/list.js');
app.get('/api/code/list', (req,res) => { code.codeList(req, res, connection)});
app.get('/api/super/list', (req,res) => { code.superCodeList(req, res, connection)});
app.get('/api/code/semester/list', (req,res) => { code.semesterList(req, res, connection)});
app.get('/api/code/classroom/list', (req,res) => { code.classroomList(req, res, connection)});
app.get('/api/code/teacher/list', (req,res) => { code.teacherList(req, res, connection)});

//관리용 공통코드 목록
const codeMList = require('./codem/list.js');
app.get('/api/codem/list', (req,res) => { codeMList.codeList(req, res, connection)});

//관리용 수퍼공통코드 목록
app.get('/api/codem/superlist', (req,res) => { codeMList.superCodeList(req, res, connection)});
app.get('/api/codem/super/dupl/list', (req,res) => { codeMList.superCodeDuplList(req, res, connection)});
app.get('/api/codem/dupl/list', (req,res) => { codeMList.codeDuplCheckList(req, res, connection)});

//관리용 수퍼공통코드 저장
const codeMSave = require('./codem/save.js');
app.post('/api/codem/super/save', upload.single('image'), (req, res) => { codeMSave.superCodeSave(req, res, connection)});

//관리용 공통코드 저장
app.post('/api/codem/code/save', upload.single('image'), (req, res) => { codeMSave.codeSave(req, res, connection)});

//관리용 수퍼공통코드 수정
const codeMUpdate = require('./codem/update.js');
app.post('/api/codem/super/update', upload.single('image'), (req, res) => { codeMUpdate.superCodeUpdate(req, res, connection)});

//관리용 공통코드 수정
app.post('/api/codem/code/update', upload.single('image'), (req, res) => { codeMUpdate.codeUpdate(req, res, connection)});

//관리용 수퍼공통코드 삭제
const codeMDelete = require('./codem/delete.js');
app.post('/api/codem/super/delete', upload.single('image'), (req, res) => { codeMDelete.superCodeDelete(req, res, connection)});

//관리용 공통코드 삭제
app.post('/api/codem/code/delete', upload.single('image'), (req, res) => { codeMDelete.codeDelete(req, res, connection)});

/***********************************************************
 * 학생관리
 * ******************************************************* */
//재학생 관리 목록
const studentList = require('./student/list.js');
app.get('/api/student/list', (req,res) => { studentList.studentList(req, res, connection)});

//학부모대표 조회
const representList = require('./student/represent.js');
app.get('/api/represent/list', (req,res) => { representList.representList(req, res, connection)});

//학부모대표 엑셀변환
app.post('/api/represent/excel', upload.single('image'), (req, res) => { representList.representListExcel(req, res, connection)});

//학생 정보 저장
const studentSave = require('./student/save.js');
app.post('/api/student/save', upload.single('image'), (req, res) => { studentSave.studentSave(req, res, connection)});

//학번 생성을 위한 유효한 일련번호 목록
app.get('/api/student/validseq/list', (req,res) => { studentSave.validSeqList(req, res, connection)});

//학생기본정보 수정
const studentUpdate = require('./student/update.js');
app.post('/api/student/basic/update', upload.single('image'), (req, res) => { studentUpdate.updateStudentBasicInfo(req, res, connection)});

//학생기본정보의 입학금 저장
app.post('/api/student/admission/update', upload.single('image'), (req, res) => { studentUpdate.updateStudentBasicInfoAddmission(req, res, connection)});

//학생가족정보 수정
app.post('/api/student/family/update', upload.single('image'), (req, res) => { studentUpdate.updateStudentFamily(req, res, connection)});

//부모님 한글명,영어명만 저장
app.post('/api/student/parents/name/update', upload.single('image'), (req, res) => { studentUpdate.updateStudentParentsName(req, res, connection)});

//학생기본정보 상세보기
const studentView = require('./student/view.js');
app.get('/api/student/view/basic', (req,res) => { studentView.viewBasicInfo(req, res, connection)});

//학생가족정보 상세보기
app.get('/api/student/view/family', (req,res) => { studentView.viewFamilyInfo(req, res, connection)});

//학생수강이력
app.get('/api/student/class/hist', (req,res) => { studentView.classHistoryList(req, res, connection)}); 

//학생상태이력
app.get('/api/student/status/hist', (req,res) => { studentView.studentStatus(req, res, connection)}); 

//학생문서발급이력
app.get('/api/student/document/hist', (req,res) => { studentView.documentHistoryList(req, res, connection)}); 

//학생 엑셀 업로드
const studentExcel = require('./student/excel.js');
app.post('/api/student/excel/save', upload.single('image'), (req, res) => { studentExcel.excelSave(req, res, connection)});

//교사비상연락망
const allstudentsList = require('./excel/allstudents.js');
app.get('/api/allstudents/list', (req,res) => { allstudentsList.allstudentsList(req, res, connection)}); 
app.post('/api/allstudents/excel', upload.single('image'), (req, res) => { allstudentsList.allstudentsListExcel(req, res, connection)});

//휴학, 졸업 학생목록 조회
const oldstudentList = require('./oldstudent/list.js');
app.get('/api/oldstudent/list', (req,res) => { oldstudentList.studentList(req, res, connection)});

//학생기본정보 상세보기
const oldstudentView = require('./oldstudent/view.js');
app.get('/api/oldstudent/view/basic', (req,res) => { oldstudentView.viewBasicInfo(req, res, connection)});

//학생가족정보 상세보기
app.get('/api/oldstudent/view/family', (req,res) => { oldstudentView.viewFamilyInfo(req, res, connection)});

/***********************************************************
 * 교사
 * ******************************************************* */
//교사 일련번호
const teacherSave = require('./teacher/save.js');
app.get('/api/teacher/validseq/list', (req,res) => { teacherSave.validSeqList(req, res, connection)});

//교사 저장
app.post('/api/teacher/save', upload.single('image'), (req, res) => { teacherSave.teacherSave(req, res, connection)});

//교사목록
const teacherList = require('./teacher/list.js');
app.get('/api/teacher/list', (req,res) => { teacherList.teacherList(req, res, connection)}); 

//교사비상연락망
const emergencyList = require('./teacher/emergency.js');
app.get('/api/emergency/list', (req,res) => { emergencyList.emergencyList(req, res, connection)}); 
app.post('/api/emergency/excel', upload.single('image'), (req, res) => { emergencyList.emergencyListExcel(req, res, connection)});

//미납자 명단
const defaulterList = require('./excel/defaulter.js');
app.get('/api/defaulter/list', (req,res) => { defaulterList.defaulterList(req, res, connection)}); 
app.post('/api/defaulter/excel', upload.single('image'), (req, res) => { defaulterList.defaulterListExcel(req, res, connection)});

//교직원 정보 상세보기
const teacherView = require('./teacher/view.js');
app.get('/api/teacher/view/basic', (req,res) => { teacherView.viewBasicInfo(req, res, connection)});

//교직원 이력
app.get('/api/teacher/course/list', (req,res) => { teacherView.courseHistory(req, res, connection)});

//학생기본정보 수정
const teacherUpdate = require('./teacher/update.js');
app.post('/api/teacher/basic/update', upload.single('image'), (req, res) => { teacherUpdate.updateTeacherBasicInfo(req, res, connection)});

//교사 계약관리 목록
const contactList = require('./contact/list.js');
app.get('/api/teacher/contact/list', (req,res) => { contactList.contactList(req, res, connection)}); 

//교사 게약 저장
const contactSave = require('./contact/save.js');
app.post('/api/teacher/contact/save', upload.single('image'), (req, res) => { contactSave.saveContact(req, res, connection)});

//교사 계약 수정
const contactUpdate = require('./contact/update.js');
app.post('/api/teacher/contact/update', upload.single('image'), (req, res) => { contactUpdate.updateContact(req, res, connection)});

//교사 계약 삭제
const contactDelete = require('./contact/delete.js');
app.post('/api/teacher/contact/delete', upload.single('image'), (req, res) => { contactDelete.deleteContact(req, res, connection)});


/***********************************************************
 * 수업료 납부 
 * ******************************************************* */
//수업료 납부 목록
const paymentList = require('./payment/list.js');
app.get('/api/payment/list', (req,res) => { paymentList.paymentList(req, res, connection)});

//수업료 납부 저장
const paymentSave = require('./payment/save.js');
//수업료 납부 최초저장
app.post('/api/payment/save', upload.single('image'), (req, res) => { paymentSave.paymentSave(req, res, connection)});
//수업료 일괄입금
app.post('/api/payment/batch/save', upload.single('image'), (req, res) => { paymentSave.paymentSaveBatch(req, res, connection)});

//수업료 납부 수정
const paymentUpdate = require('./payment/update.js');
app.post('/api/payment/update', upload.single('image'), (req, res) => { paymentUpdate.paymentUpdate(req, res, connection)});

/***********************************************************
 * 수업료 관리
 * ******************************************************* */
//수업료 목록
const schoolfeeList = require('./schoolfee/list.js');
app.get('/api/schoolfee/list', (req,res) => { schoolfeeList.schoolfeeList(req, res, connection)});

//수업료 상세
const schoolfeeView = require('./schoolfee/view.js');
app.get('/api/schoolfee/view', (req,res) => { schoolfeeView.schoolfeeView(req, res, connection)});

//수업료 저장
const schoolfeeSave = require('./schoolfee/save.js');
app.post('/api/schoolfee/save', upload.single('image'), (req, res) => { schoolfeeSave.schoolfeeSave(req, res, connection)});

//수업료 수정
const schoolfeeUpdate = require('./schoolfee/update.js');
app.post('/api/schoolfee/update', upload.single('image'), (req, res) => { schoolfeeUpdate.schoolfeeUpdate(req, res, connection)});
app.post('/api/schoolfee/semester/update', upload.single('image'), (req, res) => { schoolfeeUpdate.schoolfeeSemesterUpdate(req, res, connection)});

//수업료 삭제
const schoolfeeDelete = require('./schoolfee/delete.js');
app.post('/api/schoolfee/delete', upload.single('image'), (req, res) => { schoolfeeDelete.schoolfeeDelete(req, res, connection)});

//수업료 납부현황
const paycondition = require('./paycondition/list.js');
app.get('/api/document/paycondition/list', (req,res) => { paycondition.payconditionList(req, res, connection)});

/***********************************************************
 * 휴복학 처리 및 재학증명서
 * ******************************************************* */
//수업료 납부 목록
const studentStatusList = require('./status/list.js');

//학생상태목록
app.get('/api/student/status/list', (req,res) => { studentStatusList.studentStatusList(req, res, connection)});

/***********************************************************
 * 문서 관리
 * ******************************************************* */
//문서항목 조회
const documentView = require('./document/view.js');
app.get('/api/document/info', (req,res) => { documentView.documentInfo(req, res, connection)});
app.get('/api/document/view', (req,res) => { documentView.documentView(req, res, connection)});
app.get('/api/document/dupl', (req,res) => { documentView.documentDupl(req, res, connection)});

//문서항목 저장
const documentSave = require('./document/save.js');
app.post('/api/document/save', upload.single('image'), (req, res) => { documentSave.documentSave(req, res, connection)});

//문서항목 수정
const documentUpdate = require('./document/update.js');
app.post('/api/document/update', upload.single('image'), (req, res) => { documentUpdate.documentUpdate(req, res, connection)});

//문서항목 삭제
const documentDelete = require('./document/delete.js');
app.post('/api/document/delete', upload.single('image'), (req, res) => { documentDelete.documentDelete(req, res, connection)});

//문서발급번호 조회
const issuedNew = require('./issued/view.js');
app.get('/api/issued/new', (req,res) => { issuedNew.issuedNew(req, res, connection)});

//납입증명서 인쇄
const excelPayment = require('./excel/payment.js');
app.post('/api/print/excel/payment', upload.single('image'), (req, res) => { excelPayment.makePaymentExcel(req, res, connection)});

//기부금 영수증 인쇄
const excelContribution = require('./excel/contribution.js');
app.post('/api/print/excel/contribution', upload.single('image'), (req, res) => { excelContribution.makeContributionExcel(req, res, connection)});

//재학증명서 인쇄
const excelEnrollment = require('./excel/enrollment.js');
app.post('/api/print/excel/enrollment', upload.single('image'), (req, res) => { excelEnrollment.makeEnrollmentExcel(req, res, connection)});

//입학통지서 인쇄
const excelEntrance = require('./excel/entrance.js');
app.post('/api/print/excel/entrance', upload.single('image'), (req, res) => { excelEntrance.makeEntranceExcel(req, res, connection)});

//개근상장 인쇄
const excelAttendance = require('./excel/attendance.js');
app.post('/api/print/excel/attendance', upload.single('image'), (req, res) => { excelAttendance.makeAttendanceExcel(req, res, connection)});

//정근상장 인쇄
const excelRegular = require('./excel/regular.js');
app.post('/api/print/excel/regular', upload.single('image'), (req, res) => { excelRegular.makeRegularExcel(req, res, connection)});

//졸업장 인쇄
const excelGraduate = require('./excel/graduate.js');
app.post('/api/print/excel/graduate', upload.single('image'), (req, res) => { excelGraduate.makeGraduateExcel(req, res, connection)});

//상장 인쇄
const excelPrize = require('./excel/prize.js');
app.post('/api/print/excel/prize', upload.single('image'), (req, res) => { excelPrize.makePrizeExcel(req, res, connection)});

//재직증명서 인쇄
const excelEmployment = require('./excel/employment.js');
app.post('/api/print/excel/employment', upload.single('image'), (req, res) => { excelEmployment.makeEmpolymentExcel(req, res, connection)});

//재직증명서(한글) 인쇄
const excelEmploymentKr = require('./excel/employmentkr.js');
app.post('/api/print/excel/employmentkr', upload.single('image'), (req, res) => { excelEmploymentKr.makeEmpolymentKrExcel(req, res, connection)});

/**
 * 통계
 */
//학기별 학급 인원 현황
const semesterPersonalList = require('./stats/SemesterPersonal/list.js');
app.get('/api/stats/semester/personal/list', (req,res) => { semesterPersonalList.semesterPersonalList(req, res, connection)});

//월별 수업료 합산
const monthlySchoolfeeSumList = require('./stats/MonthlySchoolfeeSum/list.js');
app.get('/api/stats/monthly/schoolfee/sum/list', (req,res) => { monthlySchoolfeeSumList.monthlySchoolfeeSumList(req, res, connection)});
