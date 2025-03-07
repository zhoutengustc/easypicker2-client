// 接口的响应值类型定义
type ResponseData<T = any> = Promise<BaseResponse<T>>
declare namespace FileApiTypes {
    interface UploadToken {
        token: string
    }
    interface FileOptions {
        size: number
        taskKey: string
        taskName: string
        categoryKey?: string
        name: string
        info: string
        hash: string
        people?: string
    }
    interface File {
        id: number
        info: string
        name: string
        people: string
        size: number
        task_key: string
        task_name: string
        user_id: number
        category_key: string
        date: string
        hash: string
    }
    interface WithdrawFileOptions {
        taskKey: string
        taskName: string
        filename: string
        hash: string
        peopleName: string
        info: string
    }
    type getUploadToken = ResponseData<UploadToken>
    type addFile = ResponseData<any>
    type getFileList = ResponseData<{ files: File[] }>
    type getTemplateUrl = ResponseData<{ link: string }>
    type getOneFileUrl = ResponseData<{ link: string }>
    type deleteOneFile = ResponseData
    type batchDownload = ResponseData<{ k: string }>
    type batchDel = ResponseData
    type checkCompressStatus = ResponseData<{ code: number, key?: string }>
    type getCompressDownUrl = ResponseData<{ url: string }>
    type withdrawFile = ResponseData
    type checkSubmitStatus = ResponseData<{ isSubmit: boolean, txt?: string }>
}

declare namespace UserApiTypes {
    interface RegisterOptions {
        account: string
        pwd: string
        bindPhone: boolean
        phone?: string
        code?: string
    }
    type register = ResponseData<{ token?: string }>
    type login = ResponseData<{ token?: string, openTime?: string }>
    type codeLogin = ResponseData<{ token?: string, openTime?: string }>
    type resetPwd = ResponseData<{ token?: string, openTime?: string }>
    type checkPower = ResponseData<boolean>
    type checkLoginStatus = ResponseData<boolean>
}

declare namespace TaskApiTypes {
    interface TaskLog {
        date: string
        filename: string
    }
    interface TaskItem {
        category: string
        key: string
        name: string
        recentLog: TaskLog[]
    }
    interface TaskInfo {
        ddl?: string | null
        format?: string
        info?: string
        people?: number
        rewrite?: number
        share?: string
        template?: string
    }
    type getList = ResponseData<{ tasks: TaskItem[] }>
    type create = ResponseData
    type deleteOne = ResponseData
    type updateBaseInfo = ResponseData
    type getTaskInfo = ResponseData<{ name: string, category: string }>
    type getTaskMoreInfo = ResponseData<TaskInfo>
    type updateTaskMoreInfo = ResponseData
}

declare namespace PublicApiTypes {
    type getCode = ResponseData
    type reportPv = ResponseData
}

declare namespace PeopleApiTypes {
    interface People {
        count: number
        id: number
        lastDate: string
        name: string
        statue: number
    }
    type importPeople = ResponseData<{ success: number, fail: string[] }>
    type getPeople = ResponseData<{ people: People[] }>
    type deletePeople = ResponseData
    type updatePeopleStatus = ResponseData
    type checkPeopleIsExist = ResponseData<{ exist: boolean }>
}

declare namespace CateGoryApiTypes {
    interface CategoryItem {
        id: number
        name: string
        k: string
    }
    type getList = ResponseData<{ categories: CategoryItem[] }>
    type createNew = ResponseData
    type deleteOne = ResponseData
}

declare namespace OverviewApiTypes {
    interface CountLog {
        sum: number
        recent?: number
        uv?: number
    }
    interface LogItem {
        date: string
        ip: string
        msg: string
        type: string
    }
    type getCount = ResponseData<{
        file: CountLog
        log: CountLog
        pv: {
            all: CountLog
            today: CountLog
        }
        user: CountLog
    }>
    type getAllLogMsg = ResponseData<{ logs: LogItem[] }>
}

declare namespace SuperUserApiTypes {
    interface UserItem {
        account: string
        id: number
        join_time: string
        login_count: number
        login_time: string
        open_time: string
        phone: string
        status: number
    }
    type getUserList = ResponseData<{list:UserItem[]}>
    type updateUserStatus = ResponseData
}

declare namespace WishApiTypes {
    enum WishStatus{
        /**
         * 审核中
         */
        REVIEW,
        /**
         * 待开始
         */
        WAIT,
        /**
         * 开发中
         */
        START,
        /**
         * 已上线
         */
        END,
        /**
         * 关闭
         */
        CLOSE
    }
    interface Wish{
        id:string
        userId:number
        title: string
        /**
         * 详细描述
         */
        des: string
        /**
         * 联系方式
         */
        contact?:string
        /**
         * 当前进度
         */
        status: WishStatus
        startDate:Date
        endDate:Date
    }
    type addWish = ResponseData
}
