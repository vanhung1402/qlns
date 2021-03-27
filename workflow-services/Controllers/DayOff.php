<?php

namespace Controllers;

class DayOff extends BaseController
{
    function __construct() {
        parent::__construct();
    }

    public function index()
    {
        $action = post('action');
        pr($_POST);
        switch ($action){
            case 'themmoi': {
                $this->themmoi();
            }
        }
        $data['trangthai_congviec'] = $this->get_trangthai_congviec();
        $data['trangthai_phancong_congviec'] = $this->get_trangthai_phancong_congviec();
        $data['list_congviec'] = $this->get_congviec();
        echo json_encode($data);
        exit();
    }

    public function themmoi() {
        pr($_POST);
    }
}