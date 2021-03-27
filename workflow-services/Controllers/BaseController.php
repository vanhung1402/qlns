<?php

namespace Controllers;

class BaseController
{
    public $conn;
    function __construct() {
        $this->conn = mysqli_connect('localhost', 'root', '', 'db_qlns') or die ('Không thể kết nối tới database');
    }

    public function Connect()
    {
    }
    public function insert()
    {

    }
    public function get_trangthai_congviec() {
        $sql = 'SELECT * FROM dm_trangthai_congviec';
        $data = $this->conn->query($sql)->fetch_all(MYSQLI_ASSOC);
        foreach ($data as $k => $v) {
            $ttcv[$v['PK_iTrangthaiCongviecID']] = $v;
        }
        return $ttcv;
    }

    public function get_trangthai_phancong_congviec() {
        $sql = 'SELECT * FROM dm_trangthai_phancong_congviec';
        $data = $this->conn->query($sql)->fetch_all(MYSQLI_ASSOC);
        foreach ($data as $k => $v) {
            $ttpc[$v['PK_iTrangthaiPhancongCongviecID']] = $v;
        }
        return $ttpc;
    }

    public function get_congviec() {
        $sql = 'SELECT * FROM tbl_congviec';
        $data = $this->conn->query($sql)->fetch_all(MYSQLI_ASSOC);
        $congviec = array();
        foreach ($data as $k => $v) {
            $congviec[$v['PK_iCongviecID']] = $v;
        }
        return $congviec;
    }
}