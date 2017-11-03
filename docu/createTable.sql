-- 建立資料庫
create database rbs default character set utf8;

-- 使用資料庫
use rbs;

-- 建立資料表
create table `tblbooking` (
  `Id` int(11) not null auto_increment comment 'ID',
  `Name` varchar(100) not null comment '事件名稱',
  `Cont` varchar(500) default null comment '事件內容',
  `Resource` varchar(100) not null comment '使用資源',
  `DateStr` datetime not null comment '起始時間',
  `DateEnd` datetime not null comment '結束時間',
  `Color` varchar(100) not null comment '使用顏色',
  primary key (`Id`),
  unique key `name_unique` (`Id`)
);

-- 輸入測試資料
set @dt = date_add(curdate(), interval hour(now()) hour);
insert into tblbooking (Name, Cont, Resource, DateStr, DateEnd, Color) values ("業務會議", "測試資料 01", "會議室 01", @dt, date_add(@dt, interval 2 hour), "#428bca");
insert into tblbooking (Name, Cont, Resource, DateStr, DateEnd, Color) values ("主管會議", "測試資料 02", "會議室 02", @dt, date_add(@dt, interval 3 hour), "#428bca");
insert into tblbooking (Name, Cont, Resource, DateStr, DateEnd, Color) values ("研發會議", "測試資料 03", "會議室 01", @dt, date_add(@dt, interval 1 hour), "#428bca");
insert into tblbooking (Name, Cont, Resource, DateStr, DateEnd, Color) values ("小組會議", "測試資料 04", "會議室 04", @dt, date_add(@dt, interval 2 hour), "#428bca");


-- create table `tblresource` (
--   `Id` int(11) not null auto_increment comment 'ID',
--   `Name` varchar(100) not null comment '資源名稱',
--   `Kind` varchar(50) default null comment '資源種類',
--   `Color` varchar(100) default null comment '預設顏色',
--   `Enable` bit(1) not null default b'1' comment '是否有效',
--   primary key (`Id`),
--   unique key `name_unique` (`Name`)
-- );

