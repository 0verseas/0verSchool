/*  海外聯招資料表格
    Made by Nai-Jia Chen
    2016/12/18 整理校資料，移除帳號密碼兩個欄位
    2017/01/03 增加schooltypecode與deptgroupcode兩張代碼表
    2017/01/17 整理Molly(163.22.27.11)之depart,gradepart,techdepart，去除不使用欄位
    2017/01/19 depart,gradepart,techdepart將審查項目拆出獨立紀錄
    2017/01/23 整理163.22.27.22之多張代碼表
    2017/01/24 重新調整各張志願表
                1.apprank(原 self): 學士班個人申請志願表
                2.grarank(原 gradselection): 研究所個人申請志願表
                3.techrank(原 selection_two): 港二技個人申請志願表
                4.appselection(原 selection): 學士班聯合分發志願表
    2017/02/01 調整審查結果回覆表
    2017/02/08 調整applicant，去除不使用欄位，並整併各個代碼(overseasstayyear, taiwanstayday......)
    2017/02/22 調整grastudent(原 gradapplicant)、techstudent(原 applicant_two)
    2017/03/09 applicant加入isHKFor與school5欄位
    2017/03/10 applicant增加isInvalid、invalidreason，各張志願表增加無效志願(isinValid)欄位
    2017/03/11 增加資格不符代碼表(invalidcode)
    2017/03/18 調整auth，增加各檢查項(register, login_unfinished, login_finish)與開放/截止時間
*/
create table schooltypecode /* 學校屬性 */
(
    code char(1) not null, /* 代碼 */
    description varchar(10) not null, /* 屬性名 */
    primary key(code)
);
insert into schooltypecode(code,description) values('1', '公立高教');
insert into schooltypecode(code,description) values('2', '私立高教');
insert into schooltypecode(code,description) values('3', '公立技職');
insert into schooltypecode(code,description) values('4', '私立技職');
insert into schooltypecode(code,description) values('5', '僑先部');

create table deptgroupcode /* 學群類別 */
( 
    /*部分欄位是提供給官網顯示用，必須保留欄位為code,decription,academy*/
    code char(2) not null, /* 代碼 */
    description varchar(20) not null, /* 學群名稱 */
    academy varchar(20) not null, /* 所屬學院別 */
    departments varchar(1000) null default null, /* 相關科系說明 */
    career varchar(1000) null default null, /* 未來可就職相關職業 */
    group varchar(50) null default null, /* 所屬類組 */
    crossgroup varchar(100) null default null, /*跨類組*/
    context varchar(1000) null default null, /* 相關學習課程說明 */
    primary key(code)
);
create table school /* 校資料 */
( 
    schoolcode char(2) not null, /* 代碼 */
    schooltype char(1) not null, /* 學校屬性 */
    survey char(1) null default 'N', /* 已完成簡章 */
    chineseName varchar(50) not null, /* 校名 */
    englishName varchar(128) not null, /* 英文校名 */
    chineseAddress varchar(128) not null, /* 中文地址 */
    englishAddress varchar(128) not null, /* 英文地址 */
    phone varchar(30) null, /* 電話 */
    fax varchar(30) null, /* 傳真 */
    homepage varchar(50) not null, /* 網址 */
    unit varchar(20) null, /* 承辦單位 */
    username varchar(5) null, /* 聯絡人姓名 */
    userphone varchar(20) null, /* 聯絡人電話 */
    email varchar(100) null, /* 聯絡人email */
    schoolmemo text null, /* 學士備註 */
    mschoolmemo text null, /* 碩士備註 */
    pschoolmemo text null, /* 博士備註 */
    blimit smallint null, /* 學士班名額上限 */
    glimit smallint null, /* 碩士班名額上限 */
    plimit smallint null, /* 博士班名額上限 */
    allow5 char(1) not null default 'N', /* 能否收中五 */
    sortorder smallint null, /* 輸出排序 */
    approved_no varchar(400) null default null, /* 自招核定文號 */
    suspend char(1) not null default 'N',  /* 是否停招 */
    suspendreason text null, /* 停招原因或文號 */
    primary key(schoolcode)
);
create table depart 
(
    deptid char(5) not null, /* 系代碼 */
    schoolcode char(2) null, /* 校代碼 */
    deptname varchar(30) not null, /* 中文系名 */
    edeptname varchar(128) null, /* 英文系名 */
    oldcode char(4) null, /* 志願代碼 */
    amount decimal(4,0) not null default 0, /* 目前聯分名額數 */
    origamount decimal(4,0) not null default 0, /* 原始聯分名額數 */
    lastyearamount decimal(3,0) null default 0, /* 上年度分發名額 */
    selfamount decimal(3,0) null default 0, /* 目前個人申請名額 */
    origselfamount decimal(3,0) null default 0, /* 原始個人申請名額 */
    selfschool decimal(3,0) null default 0, /* 自招名額 */
    lastoffer decimal(4,0) null default 0, /* 去年提供名額 */
    specialclass char(1) null default 'N', /* 是否招收專班 */
    type char(1) not null default 'N', /* 特殊系所 N 無 */
    arttest char(1) null default 'N', /* 是否術科考試 */
    needdoc char(1) null default 'N', /* 是否書審 */
    sex char(1) not null default 'B', /* 性別限制, F女, M男 */
    lastyearart char(1) null, /* 上年度是否術科考試 */
    lastyeardoc char(1) null, /* 上年度是否書審 */
    ratify char(1) not null default 'N', /* 核定名額, Y核定,H熱門,N其它 */
    rank decimal(3,0) not null default 999, /* 志願排名 */
    homepage varchar(128) null, /* 網頁 */
    sortorder smallint null, /* 輸出排序 */
    choicememo text null, /* 選系說明 */
    docmemo text null, /* 書審說明 */
    artmemo text null, /* 術科說明 */
    deptmemo varchar(128) null, /* 備註 */
    afterbirth varchar(8) null, /* 限之後生 */
    beforebirth varchar(8) null, /* 限之前生 */
    reason text null, /* 減招原因 */
    deptgroup char(2) not null, /* 18大學群代碼 */
    s1 tinyint(3) not null default '0', /*第一梯次預配名額*/
    s2 tinyint(3) not null default '0', /*第二梯次預配名額*/
    s3 tinyint(3) not null default '0', /*第三梯次預配名額*/
    s4 tinyint(3) not null default '0', /*第四梯次預配名額*/
    s5 tinyint(3) not null default '0', /*第五梯次預配名額*/
    recurit_self varchar(1) not null default 'N', /* 是否有自招 */
    primary key(deptid),
    foreign key(schoolcode) references school
);
create table reviewinfo /* 學士班個人申請審查項目 */
(
    deptid char(5) not null, /* 系代碼 */
    processfee char(1) not null default 'N', /* 是否收取審查費 */
    address varchar(500) null default null, /* 審查資料寄送地址 */
    contact varchar(50) null default null, /* 聯絡人 */
    tel varchar(40) null default null, /* 聯絡電話 */
    mail varchar(60) null default null, /* 聯絡Email */
    x1 varchar(40) null default null, /* 審查項目1 */
    x2 varchar(40) null default null, /* 審查項目2 */
    x3 varchar(40) null default null, /* 審查項目3 */
    x4 varchar(40) null default null, /* 審查項目4 */
    x5 varchar(40) null default null, /* 審查項目5 */
    x6 varchar(40) null default null, /* 審查項目6 */
    x7 varchar(40) null default null, /* 審查項目7 */
    x8 varchar(40) null default null, /* 審查項目8 */
    x9 varchar(40) null default null, /* 審查項目9 */
    x10 varchar(40) null default null, /* 審查項目10 */
    x11 varchar(40) null default null, /* 審查項目11 */
    x12 varchar(40) null default null, /* 審查項目12 */
    y1 char(1) not null default 'N', /* 審查項目1是否必繳 */
    y2 char(1) not null default 'N', /* 審查項目2是否必繳 */
    y3 char(1) not null default 'N', /* 審查項目3是否必繳 */
    y4 char(1) not null default 'N', /* 審查項目4是否必繳 */
    y5 char(1) not null default 'N', /* 審查項目5是否必繳 */
    y6 char(1) not null default 'N', /* 審查項目6是否必繳 */
    y7 char(1) not null default 'N', /* 審查項目7是否必繳 */
    y8 char(1) not null default 'N', /* 審查項目8是否必繳 */
    y9 char(1) not null default 'N', /* 審查項目9是否必繳 */
    y10 char(1) not null default 'N', /* 審查項目10是否必繳 */
    y11 char(1) not null default 'N', /* 審查項目11是否必繳 */
    y12 char(1) not null default 'N', /* 審查項目12是否必繳 */
    z1 char(1)  not null default 'N', /* 是否只接受紙本 */
    z2 varchar(100) null default null, /* 聲明書格式檔檔名 */
    z3 char(1) not null default 'N', /* 是否需要推薦函 */
    z4 char(1) not null default 'N', /* 是否需要作品審查 */
    z5 tinyint(4) null default null, /* 作品審查數量 */
    w1 varchar(40) null default null, /* 作品1 */
    w2 varchar(40) null default null, /* 作品2 */
    w3 varchar(40) null default null, /* 作品3 */
    w4 varchar(40) null default null, /* 作品4 */
    w5 varchar(40) null default null, /* 作品5 */
    w6 varchar(40) null default null, /* 作品6 */
    primary key(deptid),
    foreign key(deptid) references depart
);
create table gradepart /* 博碩士學系 */
(
    deptid char(5) not null, /* 系代碼 */
    schoolcode char(2) null, /* 校代碼 */
    amount decimal(2,0) not null default 0, /* 錄取名額 */
    selfschool decimal(2,0) null default 0, /* 自招名額 */
    lastoffer decimal(2,0) null default 0, /* 去年提供名額 */
    lastyearamount decimal(3,0) null default 0, /* 上年度分發名額 */
    specialclass char(1) null default 'N', /* 是否招生專班 */
    deptname nvarchar(30) not null, /* 系名 */
    edeptname varchar(128) null, /* 英文系名 */
    homepage varchar(128) null, /* 網頁 */
    choicememo text null, /* 選系說明 */
    gradeptmemo varchar(128) null, /* 附註 */
    sortorder int null, /* 輸出排序 */
    reason text null, /* 減招原因 */
    deptgroup char(2) null, /* 18大學群代碼 */
    primary key(deptid),
    foreign key(schoolcode) references school
);
create table grareviewinfo /* 研究所審查項目 */
(
    deptid char(5) not null, /* 系代碼 */
    processfee char(1) not null default 'N', /* 是否收取審查費 */
    address varchar(500) null default null, /* 審查資料寄送地址 */
    contact varchar(50) null default null, /* 聯絡人 */
    tel varchar(40) null default null, /* 聯絡電話 */
    mail varchar(60) null default null, /* 聯絡Email */
    x1 varchar(40) null default null, /* 審查項目1 */
    x2 varchar(40) null default null, /* 審查項目2 */
    x3 varchar(40) null default null, /* 審查項目3 */
    x4 varchar(40) null default null, /* 審查項目4 */
    x5 varchar(40) null default null, /* 審查項目5 */
    x6 varchar(40) null default null, /* 審查項目6 */
    x7 varchar(40) null default null, /* 審查項目7 */
    x8 varchar(40) null default null, /* 審查項目8 */
    x9 varchar(40) null default null, /* 審查項目9 */
    x10 varchar(40) null default null, /* 審查項目10 */
    x11 varchar(40) null default null, /* 審查項目11 */
    x12 varchar(40) null default null, /* 審查項目12 */
    y1 char(1) not null default 'N', /* 審查項目1是否必繳 */
    y2 char(1) not null default 'N', /* 審查項目2是否必繳 */
    y3 char(1) not null default 'N', /* 審查項目3是否必繳 */
    y4 char(1) not null default 'N', /* 審查項目4是否必繳 */
    y5 char(1) not null default 'N', /* 審查項目5是否必繳 */
    y6 char(1) not null default 'N', /* 審查項目6是否必繳 */
    y7 char(1) not null default 'N', /* 審查項目7是否必繳 */
    y8 char(1) not null default 'N', /* 審查項目8是否必繳 */
    y9 char(1) not null default 'N', /* 審查項目9是否必繳 */
    y10 char(1) not null default 'N', /* 審查項目10是否必繳 */
    y11 char(1) not null default 'N', /* 審查項目11是否必繳 */
    y12 char(1) not null default 'N', /* 審查項目12是否必繳 */
    z1 char(1)  not null default 'N', /* 是否只接受紙本 */
    z2 varchar(100) null default null, /* 聲明書格式檔檔名 */
    z3 char(1) not null default 'N', /* 是否需要推薦函 */
    z4 char(1) not null default 'N', /* 是否需要作品審查 */
    z5 tinyint(4) null default null, /* 作品審查數量 */
    w1 varchar(40) null default null, /* 作品1 */
    w2 varchar(40) null default null, /* 作品2 */
    w3 varchar(40) null default null, /* 作品3 */
    w4 varchar(40) null default null, /* 作品4 */
    w5 varchar(40) null default null, /* 作品5 */
    w6 varchar(40) null default null, /* 作品6 */
    primary key(deptid),
    foreign key(deptid) references gradepart
);
create table techdepart /* 二技學系 */
(
    deptid char(5) not null, /* 系代碼 */
    schoolcode char(2) null, /* 校代碼 */
    amount decimal(2,0) not null default 0, /* 錄取名額 */
    selfschool decimal(2,0) null default 0, /* 自招名額 */
    lastoffer decimal(2,0) null default 0, /* 去年提供名額 */
    lastyearamount decimal(3,0) null default 0, /* 上年度分發名額 */
    specialclass char(1) null default 'N', /* 是否招生專班 */
    deptname nvarchar(30) not null, /* 系名 */
    edeptname varchar(128) null, /* 英文系名 */
    homepage varchar(128) null, /* 網頁 */
    choicememo ntext null, /* 選系說明 */
    gradeptmemo ntext null, /* 附註 */
    sortorder int null, /* 輸出排序 */
    reason ntext null, /* 減招原因 */
    deptgroup char(2) null, /* 18大學群代碼 */
    approved_no varchar(400) null default null, /* 自招核定文號 */
    primary key(deptid),
    foreign key(schoolcode) references school,
);
create table techreviewinfo /* 港二技申請審查項目 */
(
    deptid char(5) not null, /* 系代碼 */
    processfee char(1) not null default 'N', /* 是否收取審查費 */
    address varchar(500) null default null, /* 審查資料寄送地址 */
    contact varchar(50) null default null, /* 聯絡人 */
    tel varchar(40) null default null, /* 聯絡電話 */
    mail varchar(60) null default null, /* 聯絡Email */
    x1 varchar(40) null default null, /* 審查項目1 */
    x2 varchar(40) null default null, /* 審查項目2 */
    x3 varchar(40) null default null, /* 審查項目3 */
    x4 varchar(40) null default null, /* 審查項目4 */
    x5 varchar(40) null default null, /* 審查項目5 */
    x6 varchar(40) null default null, /* 審查項目6 */
    x7 varchar(40) null default null, /* 審查項目7 */
    x8 varchar(40) null default null, /* 審查項目8 */
    x9 varchar(40) null default null, /* 審查項目9 */
    x10 varchar(40) null default null, /* 審查項目10 */
    x11 varchar(40) null default null, /* 審查項目11 */
    x12 varchar(40) null default null, /* 審查項目12 */
    y1 char(1) not null default 'N', /* 審查項目1是否必繳 */
    y2 char(1) not null default 'N', /* 審查項目2是否必繳 */
    y3 char(1) not null default 'N', /* 審查項目3是否必繳 */
    y4 char(1) not null default 'N', /* 審查項目4是否必繳 */
    y5 char(1) not null default 'N', /* 審查項目5是否必繳 */
    y6 char(1) not null default 'N', /* 審查項目6是否必繳 */
    y7 char(1) not null default 'N', /* 審查項目7是否必繳 */
    y8 char(1) not null default 'N', /* 審查項目8是否必繳 */
    y9 char(1) not null default 'N', /* 審查項目9是否必繳 */
    y10 char(1) not null default 'N', /* 審查項目10是否必繳 */
    y11 char(1) not null default 'N', /* 審查項目11是否必繳 */
    y12 char(1) not null default 'N', /* 審查項目12是否必繳 */
    z1 char(1)  not null default 'N', /* 是否只接受紙本 */
    z2 varchar(100) null default null, /* 聲明書格式檔檔名 */
    z3 char(1) not null default 'N', /* 是否需要推薦函 */
    z4 char(1) not null default 'N', /* 是否需要作品審查 */
    z5 tinyint(4) null default null, /* 作品審查數量 */
    w1 varchar(40) null default null, /* 作品1 */
    w2 varchar(40) null default null, /* 作品2 */
    w3 varchar(40) null default null, /* 作品3 */
    w4 varchar(40) null default null, /* 作品4 */
    w5 varchar(40) null default null, /* 作品5 */
    w6 varchar(40) null default null, /* 作品6 */
    primary key(deptid),
    foreign key(deptid) references techdepart
);
create table auth /* 各梯次系統權限控制表 */
(
    stage char(1) not null, /* 梯次 */
    code varchar(10) not null, /*文憑代碼*/
    description varchar(70) not null, /* 權限說明 */
    register char(1) not null default 'Y' , /* 是否開放註冊帳號*/
    login_unfinished char(1) not null default 'Y' , /*是否開放未填報完成帳號登入*/
    login_finished char(1) not null default 'Y' , /*是否開放已填報完成帳號登入*/
    opentime timestamp not null, /*系統開放時間*/
    endtime timestamp not null, /*系統關閉時間*/
    primary key(code)
);
create table applyway /* 申請方式代碼表 */
(
    code char(2) not null, /* 代碼 */
    description varchar(70) not null, /* 說明 */
    primary key(code)
);
insert into applyway(code,description) values('00', '未選擇申請方式');
insert into applyway(code,description) values('01', '以獨中統考證書申請');
insert into applyway(code,description) values('02', '以STPM文憑申請(或A Level文憑申請者)');
insert into applyway(code,description) values('03', '以SPM文憑申請(或S.A.P、Pernyataan、O Level)');
insert into applyway(code,description) values('04', '以A LEVEL證書申請');
insert into applyway(code,description) values('05', '以海外台灣學校高中畢業資格申請');
insert into applyway(code,description) values('06', '以中學最後三年成績申請');
insert into applyway(code,description) values('07', '以SAT SUBJECT TEST成績申請');
insert into applyway(code,description) values('08', '參加學科測驗，以測驗成績申請');
insert into applyway(code,description) values('09', '參加綜合學科測驗，以測驗成績申請');
insert into applyway(code,description) values('10', '香港生以SAT SUBJECT TEST成績申請');
insert into applyway(code,description) values('11', '香港生以海外A LEVEL證書申請');
insert into applyway(code,description) values('12', '自願申請至僑先部(無須參加學科測驗)');
insert into applyway(code,description) values('13', '以中四生、中五生畢業資格申請，限分發僑先部');
insert into applyway(code,description) values('14', '以僑先部結業成績申請');
insert into applyway(code,description) values('15', '以印尼輔訓班輔訓成績申請');
insert into applyway(code,description) values('16', '以香港中學文憑考試成績(DSE)、以香港高級程度會考成績(ALE)、以香港中學會考成績(CEE)申請');
insert into applyway(code,description) values('17', '持外國學歷之港澳生以中學最後三年成績申請');
insert into applyway(code,description) values('18', '持外國學歷之港澳生以SAT SUBJECT TEST成績申請');
insert into applyway(code,description) values('19', '持外國學歷之港澳生以海外A LEVEL文憑申請');
insert into applyway(code,description) values('20', '香港副學士(或高級文憑)學生來臺升讀學士班');
insert into applyway(code,description) values('21', '以國際文憑預科課程考試（IBDP）考試成績申請');
insert into applyway(code,description) values('22', '以緬校十年級畢業資格申請，限分發僑先部特別輔導班（修業兩年）');
create table distributetaiwancode /* 分發來台狀況代碼表 */
(
    code char(1) not null, /* 代碼 */
    description varchar(70) not null, /* 說明 */
    primary key(code)
);
insert into distributetaiwancode(code,description) values('0', '無');
insert into distributetaiwancode(code,description) values('1', '未曾辦理報到入學，亦未辦理保留入學資格');
insert into distributetaiwancode(code,description) values('2', '曾經分發註冊入學，惟分發在臺期間因故自願退學且在台停留未滿一年，並返回僑居地');
create table idenitficationcode /* 身分類別代碼表 */
(
    code char(1) not null, /* 代碼；1~3給學士班使用；4~7給研究所使用*/
    description varchar(70) not null, /* 說明 */
    primary key(code)
);
insert into idenitficationcode(code,description) values('1', '海外僑生');
insert into idenitficationcode(code,description) values('2', '港澳生');
insert into idenitficationcode(code,description) values('3', '僑先部結業生');
insert into idenitficationcode(code,description) values('4', '在臺僑生');
insert into idenitficationcode(code,description) values('5', '在臺港澳生');
insert into idenitficationcode(code,description) values('6', '海外僑生');
insert into idenitficationcode(code,description) values('7', '港澳生(碩博)');
create table overseasstayyearcode /* 海外居留年限狀況代碼表 */
(
    code char(1) not null, /* 代碼 */
    description varchar(70) not null, /* 說明 */
    primary key(code)
);
insert into overseasstayyearcode(code,description) values('1', '滿八年');
insert into overseasstayyearcode(code,description) values('2', '至入學當年度8月31日前符合連續居留滿八年');
insert into overseasstayyearcode(code,description) values('3', '滿六年');
insert into overseasstayyearcode(code,description) values('4', '至入學當年度8月31日前符合連續居留滿六年');
insert into overseasstayyearcode(code,description) values('5', '僑先部結業');
create table taiwanstaydaycode /* 來台天數停留狀況代碼表 */
(
    code char(2) not null, /* 代碼 */
    description varchar(150) not null, /* 說明 */
    primary key(code)
);
insert into taiwanstaydaycode(code,description) values('00', '無 ');
insert into taiwanstaydaycode(code,description) values('01', '就讀僑務委員會舉辦之海外青年技術訓練或中央主管教育行政機關認定之技術訓練專班');
insert into taiwanstaydaycode(code,description) values('02', '就讀僑務委員會舉辦之研習班或函介之國語文研習課程，或參加經僑務委員會認定屬政府機關舉辦之活動，其研習或活動期間合計未滿二年');
insert into taiwanstaydaycode(code,description) values('03', '交換學生，其交換期間合計未滿二年');
insert into taiwanstaydaycode(code,description) values('04', '在台灣接受兵役徵召及服役');
insert into taiwanstaydaycode(code,description) values('05', '因戰亂、天災或大規模傳染病，致無法返回僑居地，且在國內停留未滿一年');
insert into taiwanstaydaycode(code,description) values('06', '因其他不可歸責於僑生之事由，致無法返回僑居地，有證明文件，且在國內停留未滿一年');
insert into taiwanstaydaycode(code,description) values('07', '懷胎7個月以上或生產、流產後未滿2個月');
insert into taiwanstaydaycode(code,description) values('08', '罹患疾病而強制其出境有生命危險之虞');
insert into taiwanstaydaycode(code,description) values('09', '在臺灣地區設有戶籍之配偶、直系血親、三親等內之旁系血親、二親等內之姻親在臺灣地區患重病或受重傷而住院或死亡');
insert into taiwanstaydaycode(code,description) values('10', '遭遇天災或其他不可避免之事變');
insert into taiwanstaydaycode(code,description) values('11', '在國內念大學');
insert into taiwanstaydaycode(code,description) values('12', '參加臺灣地區大專校院附設華語文教學機構之研習課程，其研習期間未滿2年');
insert into taiwanstaydaycode(code,description) values('13', '經中央目的事業主管機關許可來臺實習，實習期間合計未滿2年');
insert into taiwanstaydaycode(code,description) values('14', '曾經分發註冊入學，惟分發在臺期間因故自願退學且在台停留未滿一年，並返回僑居地');
create table applicantstatuscode /* 申請人狀態代碼表 */
(
    code char(1) not null, /* 代碼 */
    description varchar(150) not null, /* 說明 */
    primary key(code)
);
insert into invalidcode(code,description) values('1', '已開通');
insert into invalidcode(code,description) values('2', '已提交');
insert into invalidcode(code,description) values('3', '已點收');
insert into invalidcode(code,description) values('4', '已收件');
create table country /* 國別代碼表 */
(
    code char(3) not null, /* 代碼 */
    countryName varchar(70) not null, /* 國名 */
    state varchar(3) not null, /* 所屬洲別 */
    primary key(code)
);
create table invalidcode /* 資格不符代碼表 */
(
    code char(2) not null, /* 代碼 */
    description varchar(150) not null, /* 說明 */
    primary key(code)
);
insert into invalidcode(code,description) values('01', '僑生資格不符');
insert into invalidcode(code,description) values('02', '港澳生資格不符');
insert into invalidcode(code,description) values('03', '學歷資格資格不符');
insert into invalidcode(code,description) values('04', '單招錄取');
insert into invalidcode(code,description) values('05', '自願放棄個人申請資格');
insert into invalidcode(code,description) values('06', '自願放棄聯合分發資格');
insert into invalidcode(code,description) values('07', '重複報名馬春班');

create table applicant /* 學士班申請人資料*/
(
    id char(6) null default null, /* 僑生編號*/
    idcode char(7) not null, /* 報名序號*/
    account varchar(100) not null, /* 帳號(EMAIL)*/
    password varchar(50) not null, /* 密碼*/
    level varchar(3) not null default '學士班', /* 申請層級；僑先部或學士班*/
    stage char(1) null default null, /* 梯次別*/
    applyyear varchar(4) not null, /* 申請年度(西元)*/
    name varchar(20) null default null, /* 中文姓名*/
    ename varchar(50) null default null, /* 英文姓名*/
    country char(3) not null default '000', /* 國別*/
    groupcode char(1) null default null, /* 報名類組*/
    sex char(1) null default 'M', /* 性別*/
    birthday char(8) null, /*生日*/
    nativeProvince varchar(50) null default null, /* 籍貫(省)*/
    moveTime varchar(4) null default null, /* 移居僑居地年份*/
    moveFrom varchar(50) null default null, /* 移居僑居地前居住地*/
    address varchar(500) null default null, /* 僑居地地址*/
    phone varchar(50) null default null, /* 僑居地電話*/
    handphone varchar(50) null default null, /* 僑居地手機*/
    taiwanAddress varchar(500) null default null, /* 在台地址*/
    taiwanPhone varchar(50) null default null, /* 在台電話*/
    birthPlace char(3) null default '000', /* 出生地*/
    province varchar(50) null default null, /* 港澳生若是出生地在大陸 須填寫省份 (須討論是否可與籍貫合併)*/
    idCode varchar(50) null default null, /* 僑居地身分證*/
    passport varchar(50) null default null, /* 僑居地護照*/
    taiwanIdCodeType char(1) null default '0', /* 臺灣證件類型；0-無臺灣證件；1-身分證；2-居留證*/
    taiwanIdCode varbinary(999) default null, /* 台灣身分證*/
    taiwanPassport varchar(50) null default null, /* 台灣護照號碼*/
    fatherChineseName varchar(20) null default null, /* 父親中文姓名*/
    fatherEnglishName varchar(50) null default null, /* 父親英文姓名*/
    faBirthday char(8) null default null, /* 父親生日*/
    faProvince varchar(50) null default null, /* 父親籍貫*/
    faOccupation varchar(50) null default null, /* 父親職業*/
    faLive char(1) null default 'Y', /* 父親存歿,Y表示存，N表示歿,U表示不詳*/
    motherChineseName varchar(20) null default null, /* 母親中文姓名*/
    motherEnglishName varchar(50) null default null, /* 母親英文姓名*/
    mobirthday char(8) null default null, /* 母親生日*/
    moProvince varchar(50) null default null, /* 母親籍貫*/
    moOccupation varchar(50) null default null, /* 母親職業*/
    moLive char(1) null default 'Y', /*母親存歿,Y表示存，N表示歿,U表示不詳*/
    contactName varchar(50) null default null, /* 在台聯絡人姓名*/
    contactAddress varchar(500) null default null, /* 在台聯絡人地址*/
    contactPhone varchar(50) null default null, /*在台聯絡人電話*/
    contactRelation varchar(50) null default null, /* 與在台聯絡人關係*/
    contactServiceName varchar(500) null default null, /* 在台聯絡人服務機關*/
    contactServicePhone varchar(50) null default null, /*在台聯絡人服務機關電話*/
    lastSchool varchar(100) null default null, /* 最高學歷學校*/
    lastSchoolCountry char(3) not null default '000', /* 最高學歷取得的國家*/
    lastEnterTime varchar(8) null default null, /* 學歷取得學校入學時間*/
    lastGraTime varchar(8) null default null, /* 學歷取得學校畢業時間*/
    applyWay char(2) not null default '00', /* 成績採計方式(適用簡章)*/
    identification char(1) null default null, /*身分類別*/,
    distributeTaiwan char(1) null default '0', /* 是否曾透過本會分發來台*/
    distributeTaiwanYear varchar(4) null default null, /* 哪一年分發來臺的*/
    overseasStayYear char(1) null default null, /* 海外居留狀況*/
    taiwanStayDay char(2) null default null, /* 來台天數是否超過90天*/
    olympia char(1) not null default 'N', /* 是否有奧林匹亞*/
    holdpassport char(1) not null default 'N', /* 是否持有外國護照*/
    holdpassportcountry char(3) null default '000', /* 持有外國護照的國家的代碼*/
    disability char(1) null default 'N', /* 是否為身心障礙*/
    disabilityExplain varchar(500) null default null, /* 身心障礙描述*/
    disabilityLevel varchar(10) null default null, /* 障礙程度*/
    distributionDocNumber varchar(40) null, /* 分發文號 */
    distributionDate varchar(20) null, /* 發文日期 */
    isfinished char(1) default 'N', /* 確認是否已提交申請資料*/
    rtime timestamp not null default '0000-00-00 00:00:00', /*註冊時間*/
    ftime timestamp not null default '0000-00-00 00:00:00', /*填報完成時間*/
    propose varchar(500) null, /* 保薦單位 */
    isInvalid char(1) not null default 'N', /* 是否資格不符*/,
    invalidreason char(2) not null default '00', /*資格不符原因*/
    status char(1) not null default '1', /*申請人帳號狀態*/
    school5 char(1) not null default 'N', /* 是否為中五生*/
    isHKfor char(1) not null default 'N', /* 是否為港澳生持外國學歷*/
    primary key(idcode)
);
create table grastudent
(
    id char(6) null default null, /* 僑生編號*/
    idcode char(7) not null, /* 報名序號*/
    account varchar(100) not null, /* 帳號(EMAIL)*/
    password varchar(50) not null, /* 密碼*/
    level varchar(3) not null default '學士班', /* 申請層級；碩士班或博士班 (與groupcode相似，僅保留一個欄位)*/
    applyyear varchar(4) not null, /* 申請年度(西元)*/
    name varchar(20) null default null, /* 中文姓名*/
    ename varchar(50) null default null, /* 英文姓名*/
    country char(3) not null default '000', /* 國別*/
    sex char(1) null default 'M', /* 性別*/
    birthday char(8) null, /*生日*/
    nativeProvince varchar(50) null default null, /* 籍貫(省)*/
    moveTime varchar(4) null default null, /* 移居僑居地年份*/
    moveFrom varchar(50) null default null, /* 移居僑居地前居住地*/
    address varchar(500) null default null, /* 僑居地地址*/
    phone varchar(50) null default null, /* 僑居地電話*/
    handphone varchar(50) null default null, /* 僑居地手機*/
    taiwanAddress varchar(500) null default null, /* 在台地址*/
    taiwanPhone varchar(50) null default null, /* 在台電話*/
    birthPlace char(3) null default '000', /* 出生地*/
    province varchar(50) null default null, /* 港澳生若是出生地在大陸 須填寫省份 (須討論是否可與籍貫合併)*/
    idCode varchar(50) null default null, /* 僑居地身分證*/
    passport varchar(50) null default null, /* 僑居地護照*/
    taiwanIdCodeType char(1) null default '0', /* 臺灣證件類型；0-無臺灣證件；1-身分證；2-居留證*/
    taiwanIdCode varbinary(999) default null, /* 台灣身分證*/
    taiwanPassport varchar(50) null default null, /* 台灣護照號碼*/
    fatherChineseName varchar(20) null default null, /* 父親中文姓名*/
    fatherEnglishName varchar(50) null default null, /* 父親英文姓名*/
    faBirthday char(8) null default null, /* 父親生日*/
    faProvince varchar(50) null default null, /* 父親籍貫*/
    faOccupation varchar(50) null default null, /* 父親職業*/
    faLive char(1) null default 'Y', /* 父親存歿,Y表示存，N表示歿,U表示不詳*/
    motherChineseName varchar(20) null default null, /* 母親中文姓名*/
    motherEnglishName varchar(50) null default null, /* 母親英文姓名*/
    mobirthday char(8) null default null, /* 母親生日*/
    moProvince varchar(50) null default null, /* 母親籍貫*/
    moOccupation varchar(50) null default null, /* 母親職業*/
    moLive char(1) null default 'Y', /*母親存歿,Y表示存，N表示歿,U表示不詳*/
    contactName varchar(50) null default null, /* 在台聯絡人姓名*/
    contactAddress varchar(500) null default null, /* 在台聯絡人地址*/
    contactPhone varchar(50) null default null, /*在台聯絡人電話*/
    contactRelation varchar(50) null default null, /* 與在台聯絡人關係*/
    contactServiceName varchar(500) null default null, /* 在台聯絡人服務機關*/
    contactServicePhone varchar(50) null default null, /*在台聯絡人服務機關電話*/
    lastSchool varchar(100) null default null, /* 最高學歷學校*/
    lastSchoolCountry char(3) not null default '000', /* 最高學歷取得的國家*/
    lastEnterTime varchar(8) null default null, /* 學歷取得學校入學時間*/
    lastGraTime varchar(8) null default null, /* 學歷取得學校畢業時間*/
    identification char(1) null default null, /*身分類別*/,
    distributeTaiwan char(1) null default '0', /* 是否曾透過本會分發來台*/
    distributeTaiwanYear varchar(4) null default null, /* 哪一年分發來臺的*/
    overseasStayYear char(1) null default null, /* 海外居留狀況*/
    taiwanStayDay char(2) null default null, /* 來台天數是否超過90天*/
    holdpassport char(1) not null default 'N', /* 是否持有外國護照*/
    holdpassportcountry char(3) null default '000', /* 持有外國護照的國家的代碼*/
    disability char(1) null default 'N', /* 是否為身心障礙*/
    disabilityExplain varchar(500) null default null, /* 身心障礙描述*/
    disabilityLevel varchar(10) null default null, /* 障礙程度*/
    distributionDocNumber varchar(40) null, /* 分發文號 */
    distributionDate varchar(20) null, /* 發文日期 */
    isfinished char(1) default 'N', /* 確認是否已提交申請資料*/
    major varchar(30) not null default '', /* 主修*/
    dmajor varchar(30) not null default '', /*雙主修*/
    rtime timestamp not null default '0000-00-00 00:00:00', /*註冊時間*/
    ftime timestamp not null default '0000-00-00 00:00:00', /*填報完成時間*/
    propose varchar(500) null, /* 保薦單位 */
    isInvalid char(1) not null default 'N', /* 是否資格不符*/,
    invalidreason char(2) not null default '00', /*資格不符原因*/
    status char(1) not null default '1', /*申請人帳號狀態*/
    primary key(idcode)
);
create table techstudent
(
    id char(6) null default null, /* 僑生編號*/
    idcode char(7) not null, /* 報名序號*/
    account varchar(100) not null, /* 帳號(EMAIL)*/
    password varchar(50) not null, /* 密碼*/
    applyyear varchar(4) not null, /* 申請年度(西元)*/
    name varchar(20) null default null, /* 中文姓名*/
    ename varchar(50) null default null, /* 英文姓名*/
    country char(3) not null default '000', /* 國別*/
    sex char(1) null default 'M', /* 性別*/
    birthday char(8) null, /*生日*/
    nativeProvince varchar(50) null default null, /* 籍貫(省)*/
    moveTime varchar(4) null default null, /* 移居僑居地年份*/
    moveFrom varchar(50) null default null, /* 移居僑居地前居住地*/
    address varchar(500) null default null, /* 僑居地地址*/
    phone varchar(50) null default null, /* 僑居地電話*/
    handphone varchar(50) null default null, /* 僑居地手機*/
    taiwanAddress varchar(500) null default null, /* 在台地址*/
    taiwanPhone varchar(50) null default null, /* 在台電話*/
    birthPlace char(3) null default '000', /* 出生地*/
    province varchar(50) null default null, /* 港澳生若是出生地在大陸 須填寫省份 (須討論是否可與籍貫合併)*/
    idCode varchar(50) null default null, /* 僑居地身分證*/
    passport varchar(50) null default null, /* 僑居地護照*/
    taiwanIdCodeType char(1) null default '0', /* 臺灣證件類型；0-無臺灣證件；1-身分證；2-居留證*/
    taiwanIdCode varbinary(999) default null, /* 台灣身分證*/
    taiwanPassport varchar(50) null default null, /* 台灣護照號碼*/
    fatherChineseName varchar(20) null default null, /* 父親中文姓名*/
    fatherEnglishName varchar(50) null default null, /* 父親英文姓名*/
    faBirthday char(8) null default null, /* 父親生日*/
    faProvince varchar(50) null default null, /* 父親籍貫*/
    faOccupation varchar(50) null default null, /* 父親職業*/
    faLive char(1) null default 'Y', /* 父親存歿,Y表示存，N表示歿,U表示不詳*/
    motherChineseName varchar(20) null default null, /* 母親中文姓名*/
    motherEnglishName varchar(50) null default null, /* 母親英文姓名*/
    mobirthday char(8) null default null, /* 母親生日*/
    moProvince varchar(50) null default null, /* 母親籍貫*/
    moOccupation varchar(50) null default null, /* 母親職業*/
    moLive char(1) null default 'Y', /*母親存歿,Y表示存，N表示歿,U表示不詳*/
    contactName varchar(50) null default null, /* 在台聯絡人姓名*/
    contactAddress varchar(500) null default null, /* 在台聯絡人地址*/
    contactPhone varchar(50) null default null, /*在台聯絡人電話*/
    contactRelation varchar(50) null default null, /* 與在台聯絡人關係*/
    contactServiceName varchar(500) null default null, /* 在台聯絡人服務機關*/
    contactServicePhone varchar(50) null default null, /*在台聯絡人服務機關電話*/
    lastSchool varchar(100) null default null, /* 最高學歷學校*/
    lastSchoolCountry char(3) not null default '000', /* 最高學歷取得的國家*/
    lastEnterTime varchar(8) null default null, /* 學歷取得學校入學時間*/
    lastGraTime varchar(8) null default null, /* 學歷取得學校畢業時間*/
    identification char(1) null default null, /*身分類別 (由於港二技僅香港學生申請，考慮可宜除此欄位)*/,
    distributeTaiwan char(1) null default '0', /* 是否曾透過本會分發來台*/
    distributeTaiwanYear varchar(4) null default null, /* 哪一年分發來臺的*/
    overseasStayYear char(1) null default null, /* 海外居留狀況*/
    taiwanStayDay char(2) null default null, /* 來台天數是否超過90天*/
    holdpassport char(1) not null default 'N', /* 是否持有外國護照*/
    holdpassportcountry char(3) null default '000', /* 持有外國護照的國家的代碼*/
    disability char(1) null default 'N', /* 是否為身心障礙*/
    disabilityExplain varchar(500) null default null, /* 身心障礙描述*/
    disabilityLevel varchar(10) null default null, /* 障礙程度*/
    distributionDocNumber varchar(40) null, /* 分發文號 */
    distributionDate varchar(20) null, /* 發文日期 */
    isfinished char(1) default 'N', /* 確認是否已提交申請資料*/
    course varchar(30) not null default '', /* 文憑課程*/
    cstarttime varchar(30) not null default '', /* 課程認可起始時間 (須討論)*/
    cendtime varchar(30) not null default '', /* 課程認可結束時間 (須討論，文憑可持續登記有效)*/
    ctype varchar(20) not null default '', /* 文憑類別；1-副學士；2-高級文憑*/
    rtime timestamp not null default '0000-00-00 00:00:00', /*註冊時間*/
    ftime timestamp not null default '0000-00-00 00:00:00', /*填報完成時間*/
    propose varchar(500) null, /* 保薦單位 */
    isInvalid char(1) not null default 'N', /* 是否資格不符*/,
    invalidreason char(2) not null default '00', /*資格不符原因*/
    status char(1) not null default '1', /*申請人帳號狀態*/
    primary key(idcode)
);
create table apprank /* 學士班個人申請志願表 */
(
    idcode char(7) not null, /* 報名序號 */
    deptid char(5) not null, /* 志願系代碼 */
    ser char(2) not null, /* 志願序 */
    isinValid char(1) not null defalut 'N', /* 是否為無效志願 */
    primary key(idcode, ser),
    foreign key(idcode) references applicant,
    foreign key(deptid) references depart
);
create table grarank /* 研究所志願表 */
(
    idcode char(7) not null, /* 報名序號 */
    deptid char(5) not null, /* 志願系代碼 */
    ser char(2) not null, /* 志願序 */
    isinValid char(1) not null defalut 'N', /* 是否為無效志願 */
    primary key(idcode, ser),
    foreign key(idcode) references grastudent,
    foreign key(deptid) references gradepart
);
create table techrank /* 港二技志願表 */
(
    idcode char(7) not null, /* 報名序號 */
    deptid char(5) not null, /* 志願系代碼 */
    ser char(2) not null, /* 志願序 */
    isinValid char(1) not null defalut 'N', /* 是否為無效志願 */
    primary key(idcode, ser),
    foreign key(idcode) references techstudent,
    foreign key(deptid) references techdepart
);
create table appselection /* 學士班聯合分發志願表 */
(
    idcode char(7) not null, /* 報名序號 */
    deptid char(5) not null, /* 志願系代碼 */
    ser char(2) not null, /* 志願序 */
    isinValid char(1) not null defalut 'N', /* 是否為無效志願 */
    primary key(idcode, ser),
    foreign key(idcode) references applicant,
    foreign key(deptid) references depart
);
create table hkschool /* 港澳學歷記錄表 */
(
);
create table olympia /* 奧林匹亞志願記錄表 */
(
    idcode char(7) not null, /* 報名序號 */
    deptid char(5) not null, /* 志願系代碼 */
    ser char(2) not null, /* 志願序 */
    primary key(idcode, ser),
    foreign key(idcode) references applicant,
    foreign key(deptid) references depart
);
create table malaysiacode /* 馬來西亞獨中統考記錄表 */
(
    idcode char(7) not null, /* 報名序號 */
    testcode tinytext not null, /* 獨中統考編號 */
    primary key(idcode),
    foreign key(idcode) references applicant
);
create table replyreasoncode /* 審查回復結果不合格原因代碼表 */
(
    code char(2) null default null, /* 代碼 */
    description varchar(70) not null, /* 不合格原因說明 */
    primary key(code)
);
create table reply /* 學士班審查回復結果 */
(
    deptid char(5) not null, /* 系代碼 */
    schoolcode char(2) not null, /* 校代碼 */
    idcode char(7) not null, /* 報名序號 */
    rank  int(5) not null default '-1', /* 合格排序，未審查預設為-1 */
    reason char(2) null default null, /* 不合格原因 */
    primary key(deptid, schoolcode, idcode),
    foreign key(deptid) references depart,
    foreign key(schoolcode) references school,
    foreign key(idcode) references applicant
);
create table grareply /* 研究所審查回復結果 */
(
    deptid char(5) not null, /* 系代碼 */
    schoolcode char(2) not null, /* 校代碼 */
    idcode char(7) not null, /* 報名序號 */
    rank  int(5) not null default '-1', /* 合格排序，未審查預設為-1 */
    reason char(2) null default null, /* 不合格原因 */
    primary key(deptid, schoolcode, idcode),
    foreign key(deptid) references gradepart,
    foreign key(schoolcode) references school,
    foreign key(idcode) references grastudent
);
create table techreply /* 港二技審查回復結果 */
(
    deptid char(5) not null, /* 系代碼 */
    schoolcode char(2) not null, /* 校代碼 */
    idcode char(7) not null, /* 報名序號 */
    rank  int(5) not null default '-1', /* 合格排序，未審查預設為-1 */
    reason char(2) null default null, /* 不合格原因 */
    primary key(deptid, schoolcode, idcode),
    foreign key(deptid) references techdepart,
    foreign key(schoolcode) references school,
    foreign key(idcode) references techstudent
);
