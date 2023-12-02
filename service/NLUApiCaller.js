import AsyncStorage from '@react-native-async-storage/async-storage';
import Student from '../model/Student';
import Semester from '../model/Semester';
import Subject from '../model/Subject';
import Exam from '../model/Exam';
import Grade from '../model/Grade';
import ScoreBoard from '../model/ScoreBoard';
import Notification from '../model/Notification';
import SubjectClass from '../model/SubjectClass';
import ResultRegister from '../model/ResultRegister';

export async function LoginDefault(){
    const username = await AsyncStorage.getItem('username');
    const password = await AsyncStorage.getItem('password');
    const student = await LoginNLU(username, password);
    return student;
}

//Login to NLU API
//return a student object or null if error
export async function LoginNLU(username, password) {
    const grant_type = "password";
    const urlString = "https://dkmh.hcmuaf.edu.vn/api/auth/login";
    const params = `username=${username}&password=${password}&grant_type=${grant_type}`;

    const response = await fetch(urlString, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
    });

    if (response.ok) {
        const responseData = await response.json();
        const token = responseData.access_token;
        const id = responseData.userName;
        const name = responseData.name;
        const student = new Student(id, name, token);

        const studentJson = JSON.stringify(student);
        AsyncStorage.setItem("token", token);
        AsyncStorage.setItem("student", studentJson);
        AsyncStorage.setItem("id", id);
        AsyncStorage.setItem("username", username);
        AsyncStorage.setItem("password", password);

        return student;
    }
    return null;
}

//Get list of semester
//return a list of semester or null if error
export async function getSemesters() {
    const urlString = "https://dkmh.hcmuaf.edu.vn/api/sch/w-locdshockytkbuser";
    const token = await AsyncStorage.getItem('token');
    const params = "{\"filter\":{\"is_tieng_anh\":null},\"additional\":{\"paging\":{\"limit\":100,\"page\":1},\"ordering\":[{\"name\":\"hoc_ky\",\"order_type\":1}]}}";

    const response = await fetch(urlString, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: params,
    });

    if (response.ok) {
        const res = [];
        const responseData = await response.json();
        const listSemester = responseData.data.ds_hoc_ky;
        for (let i = 0; i < listSemester.length; i++) {
            const item = listSemester[i];
            const id = item.hoc_ky;
            const name = item.ten_hoc_ky;
            const startDate = StringToDate(item.ngay_bat_dau_hk);
            const endDate = StringToDate(item.ngay_ket_thuc_hk);

            const semester = new Semester(id, name, startDate, endDate);
            res.push(semester);
        }
        return res;
    }
    return null;
}

//Get list of subject in a semester
//return a list of subject in a semester or null if error
export async function getSchedule(idSemester) {
    const urlString = "https://dkmh.hcmuaf.edu.vn/api/sch/w-locdstkbhockytheodoituong";
    const token = await AsyncStorage.getItem('token');
    const params = "{hoc_ky: " + idSemester + ", loai_doi_tuong: 1, id_du_lieu: null}";

    const response = await fetch(urlString, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: params,
    });

    if (response.ok) {
        const res = [];
        const responseData = await response.json();
        const listSubject = responseData.data.ds_nhom_to;
        for (let i = 0; i < listSubject.length; i++) {
            const item = listSubject[i];
            const id = item.ma_mon;
            const name = item.ten_mon;
            const group = item.nhom_to;
            const classes = item.lop;
            const classroom = item.phong;
            const teacher = item.gv;
            const numOfCredit = item.so_tc;
            const day = item.thu;
            const lessonStart = item.tbd;
            const numOfLesson = item.so_tiet;
            const rangeTime = item.tkb;

            const startDate = StringToDate(rangeTime.substring(0, 8));
            const endDate = StringToDate(rangeTime.substring(13, rangeTime.length));

            const subject = new Subject(id, name, group, classes, classroom, teacher, numOfCredit, day, lessonStart, numOfLesson, startDate, endDate);
            res.push(subject);
        }
        return res;
    }
    return null;
}

//Get list of test day in a semester
//return a list of test day in a semester or null if error
export async function getExams(idSemester) {
    const urlString = "https://dkmh.hcmuaf.edu.vn/api/epm/w-locdslichthisvtheohocky";
    const token = await AsyncStorage.getItem('token');
    const params = "{\"filter\":{\"hoc_ky\":" + idSemester + "},\"additional\":{\"paging\":{\"limit\":100,\"page\":1},\"ordering\":[{\"name\":null,\"order_type\":null}]}}";

    const response = await fetch(urlString, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: params,
    });

    if (response.ok) {
        const res = [];
        const responseData = await response.json();
        const listExam = responseData.data.ds_lich_thi;
        for (let i = 0; i < listExam.length; i++) {
            const item = listExam[i];
            const numOrder = item.so_thu_tu;
            const id = item.ma_mon;
            const name = item.ten_mon;
            const testDay = StringToDate(item.ngay_thi);
            const examRoom = item.ma_phong;
            const lessonStart = item.tiet_bat_dau;
            const numOfLesson = item.so_tiet;
            const examForm = item.hinh_thuc_thi;

            const exam = new Exam(numOrder, id, name, testDay, examRoom, lessonStart, numOfLesson, examForm);
            res.push(exam);
        }
        return res;
    }
    return null;
}

//Get score board for all semester
//return a list of score board or null if error
export async function getScoreBoard() {
    const urlString = "https://dkmh.hcmuaf.edu.vn/api/srm/w-locdsdiemsinhvien";
    const token = await AsyncStorage.getItem('token');
    const params = "";

    const response = await fetch(urlString, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: params,
    });

    if (response.ok) {
        const res = [];
        const responseData = await response.json();
        const listGrade = responseData.data.ds_diem_hocky;
        for (let i = 0; i < listGrade.length; i++) {
            const scoreSemester = listGrade[i];
            const name = scoreSemester.ten_hoc_ky + "";
            let scoreSemester4 = "";
            let scoreSemester10 = "";
            let numSemesterCredit = "";
            let score4 = "";
            let score10 = "";
            let numCredit = "";

            if (scoreSemester.dtb_hk_he4 !== null) {
                scoreSemester4 = scoreSemester.dtb_hk_he4;
                scoreSemester10 = scoreSemester.dtb_hk_he10;
                numSemesterCredit = scoreSemester.so_tin_chi_dat_hk;
                score4 = scoreSemester.dtb_tich_luy_he_4;
                score10 = scoreSemester.dtb_tich_luy_he_10;
                numCredit = scoreSemester.so_tin_chi_dat_tich_luy;
            }

            const scores = [];
            const listSemesterScore = scoreSemester.ds_diem_mon_hoc;

            for (let j = 0; j < listSemesterScore.length; j++) {
                const item = listSemesterScore[j];
                const idSubject = item.ma_mon;
                const subjectName = item.ten_mon;
                const grade = item.diem_tk;
                const charGrade = item.diem_tk_chu;
                const grades = new Grade(idSubject, subjectName, grade, charGrade);
                scores.push(grades);
            }

            res.push(new ScoreBoard(name, scoreSemester4, scoreSemester10, numSemesterCredit, score4, score10, numCredit, scores));
        }
        return res;
    }
    return null;
}


//get list of notification
//return list of notification or null if error
export async function getNotifications() {
    const urlString = "https://dkmh.hcmuaf.edu.vn/api/web/w-locdsbaiviet";
    const params = '{"filter":{"ky_hieu":"tb","is_hien_thi":true,"is_hinh_dai_dien":true,"so_luong_hinh_dai_dien":1},"additional":{"paging":{"limit":500,"page":1},"ordering":[{"name":"do_uu_tien","order_type":1},{"name":"ngay_dang_tin","order_type":1}]}}';

    const response = await fetch(urlString, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: params,
    });

    if (response.ok) {
        const res = [];
        const responseData = await response.json();
        const listNotification = responseData.data.ds_bai_viet;
        for (let i = 0; i < listNotification.length; i++) {
            const item = listNotification[i];
            const id = item.id;
            const uploadDate = new Date(item.ngay_dang_tin);
            const modifyDate = new Date(item.ngay_hieu_chinh);
            const title = item.tieu_de;

            const notification = new Notification(id, title, "", uploadDate, modifyDate);
            res.push(notification);
        }
        return res;
    }
    return null;
}

//get content of a notification by id
//return notification object with content or null if error
export async function getNotification(idNotification) {
    const urlString = "https://dkmh.hcmuaf.edu.vn/api/web/w-locdsbaiviet";
    const params = '{"filter":{"id":"' + idNotification + '","is_noi_dung":true,"is_hinh_dai_dien":false,"is_quyen_xem":false,"is_hien_thi":true,"so_luong_hinh_dai_dien":1},"additional":{"paging":{"limit":1,"page":1,"isLimit":false},"ordering":[{"name":null,"order_type":null}]}}';

    const response = await fetch(urlString, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: params,
    });

    if (response.ok) {
        const responseData = await response.json();
        const listNotification = responseData.data.ds_bai_viet;

        if (listNotification.length < 1) return null;
        const item = listNotification[0];
        const id = item.id;
        const title = item.tieu_de;
        const content = item.noi_dung;
        const uploadDate = new Date(item.ngay_dang_tin);
        const modifyDate = new Date(item.ngay_hieu_chinh);

        return new Notification(id, title, content, uploadDate, modifyDate);
    }
    return null;
}

//Get list of subject class in this semester
//return a list of subject class in this semester or null if error
export async function getSubjectClass() {
    const urlString = "https://dkmh.hcmuaf.edu.vn/api/dkmh/w-locdsnhomto";
    const token = await AsyncStorage.getItem('token');
    const params = "{'is_CVHT':false,'additional':{'paging':{'limit':10000,'page':1},'ordering':[{'name':'','order_type':''}]}}";

    const response = await fetch(urlString, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: params,
    });

    if (response.ok) {
        const res = [];
        const responseData = await response.json();

        let subjectMap = new Map();
        const listSubject = responseData.data.ds_mon_hoc;
        for (let i = 0; i < listSubject.length; i++) {
            const item = listSubject[i];
            subjectMap.set(item.ma, item.ten);
        }

        const listSubjectClass = responseData.data.ds_nhom_to;
        for (let i = 0; i < listSubjectClass.length; i++) {
            const item = listSubjectClass[i];
            const id = item.id_to_hoc;
            const Class = item.lop;
            const idSubject = item.ma_mon;
            const name = subjectMap.get(idSubject);
            const day = item.thu;
            const startLesson = item.tbd;
            const numLesson = item.so_tiet;
            const group = item.nhom_to;
            const remain = item.sl_cl;
            const numStudent = item.sl_cp;
            const numCredit = item.so_tc_so;
            const schedule = item.tkb;

            const subjectClass = new SubjectClass(id, idSubject, name, day, startLesson, numLesson, group, Class, numStudent, remain, numCredit, schedule);
            res.push(subjectClass);
        }
        return res;
    }
    return null;
}

//let register a subject class. if subject is registered, you will cancel register this subject
//return ok message if success, error message if not success, null if error
export async function registerSubject(idSubjectClass) {
    const urlString = "https://dkmh.hcmuaf.edu.vn/api/dkmh/w-xulydkmhsinhvien";
    const token = await AsyncStorage.getItem('token');
    const params = "{'filter':{'id_to_hoc':'" + idSubjectClass + "','is_checked':true,'sv_nganh':1}}";

    const response = await fetch(urlString, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: params,
    });

    if (response.ok) {
        const responseData = await response.json();
        console.log(responseData)
        const isSuccess = responseData.data.is_thanh_cong;
        if (!isSuccess) return responseData.data.thong_bao_loi;
        const enableDelete = responseData.data.ket_qua_dang_ky.enable_xoa;
        if (enableDelete)
            return true;
        else return false;
    }
    return null;
}

//Get list of register result 
//return a list of register result or null if error
export async function getResultRegister() {
    const urlString = "https://dkmh.hcmuaf.edu.vn/api/dkmh/w-locdskqdkmhsinhvien";
    const token = await AsyncStorage.getItem('token');
    const params = '{"is_CVHT":false,"is_Clear":false}';

    const response = await fetch(urlString, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: params,
    });

    if (response.ok) {
        const res = [];
        const responseData = await response.json();
        const code = responseData.code;

        if (code == 200) {
            const listResult = responseData.data.ds_kqdkmh;
            for (let i = 0; i < listResult.length; i++) {
                const item = listResult[i];
                const id = item.id_to_hoc;
                const registerDate = item.ngay_dang_ky;
                const subject = item.to_hoc;
                const name = subject.ten_mon;
                const idSubject = subject.ma_mon;
                const group = subject.nhom_to;
                const numCredit = subject.so_tc;

                const result = new ResultRegister(id, idSubject, name, group, numCredit, new Date(registerDate));
                res.push(result);
            }
            return res;
        }

    }
    return null;
}

function StringToDate(dateString) {
    let parts = dateString.split("/");
    let formattedDate = parts[2] + "-" + parts[1] + "-" + parts[0];
    return new Date(formattedDate);
}



