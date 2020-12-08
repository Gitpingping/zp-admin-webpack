
import axios from 'axios'
import store from '../store'
import { Modal } from 'ant-design-vue';
// import { removeToken } from '../utils/auth'

declare var $: any;
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// build http header
function buildHeader(): { [key: string]: string } {
    return {
        'Content-Type': 'application/json;charset=UTF-8;multipart/form-data'
    }
}

export let ax = axios.create({
    baseURL: host(),
    headers: buildHeader(),
    timeout: 20000000,
    responseType: 'json',
    withCredentials: false,
    transformRequest: [
        function (data) {
            if (data instanceof FormData) return data
            return JSON.stringify(data)
        }
    ],
    transformResponse: [
        function (data) {
            if (data) {
                return data
            } else {
                let msg = 'Unknow Error'
                throw new Error(msg)
            }
        }
    ],
    // `onUploadProgress`允许处理上传的进度事件
    onUploadProgress: function (progressEvent) {
        // 使用本地 progress 事件做任何你想要做的
    },
    // `onDownloadProgress`允许处理下载的进度事件
    onDownloadProgress: function (progressEvent) {
        // Do whatever you want with the native progress event
    },
})

export  function host(){
    if (window.location.hostname == "localhost" || window.location.hostname.indexOf('192.168') > -1) {
        return "/cspcommsystem/"                //代理
        //  return "http://192.168.3.5:5000/api"  
        // return "http://192.168.2.166:5000/api"  //姚正才
        // return "http://192.168.2.35:5000/api"  //姚正才
        // return "http://192.168.1.243:5000/api/"  //刘飞
    } else if (window.location.hostname == "wdwx.jfry.cn" || window.location.hostname == 'wdwx.sowl.cn') {
        return "/api/" 
    } else {
        return "/api/"
    }
}

// http request 拦截器
ax.interceptors.request.use(
    config => {
        const jwtToken = localStorage.getItem('token')
        if (jwtToken) {
            config.headers.Authorization = `Bearer ${jwtToken}`;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });

// http response 拦截器
ax.interceptors.response.use(
    
    response => {
        if (!response.data.success) {
            Modal.warning({
                title: '提示',
                content: response.data.errorMessage
            })
            console.log('response.data.errorCode', response.data.errorCode);
            return Promise.reject(response.data.errorMessage)

            // throw response;
        } else {
            return response.data
        }
    },
    error => {
        // if (error.response) {
        //     switch (error.response.status) {

        //     }
        // }
        // MessageBox.alert('网络开小差了，请稍后再试', '提示', {
        //     confirmButtonText: '确定'
        // })
        // return Promise.reject(error.response.data)
    });

/* 手动取消请求的不显示报错 */
function handleError(err: Error) {
    // 如果是手动取消的请求，不显示错误信息
    if (axios.isCancel(err)) {
        // console.log(err)
    } else {
        // bootbox.alert(err)
    }
}

/* GET  */
export function Get<T>(url: string, data?: any): Promise<T> {
    // `params`是要与请求一起发送的URL参数
    // 必须是纯对象或URLSearchParams对象
    return ax
        .get(url, {
            params: data
        })
        .then(res => {
            return res.data
        })
        .catch(err => {
            handleError(err)
            throw err
        })
}


/* POST */
export function Post<T>(url: string, data?: any): Promise<T> {
    return ax
        .post(url, data)
        .then(res => {
            return res.data
        })
        .catch(err => {
            handleError(err)
            throw err
        })
}
/* PUT */
export function Put<T>(url: string, data?: any): Promise<T> {
    return ax
        .put(url, data)
        .then(res => {
            return res.data
        })
        .catch(err => {
            handleError(err)
            throw err
        })
}
/* PUT */
export function $Put<T>(url: string, data?: any): Promise<T> {
    let urls = url;
    Object.keys(data).forEach((v,index)=>{
        urls+=index === 0 ? `?${v}=${data[v]}`:`&${v}=${data[v]}`
    })
    return ax
        .put(urls, data)
        .then(res => {
            return res.data
        })
        .catch(err => {
            handleError(err)
            throw err
        })
}
/* PATCH */
export function Patch<T>(url: string, data?: any): Promise<T> {
    return ax
        .patch(url, data)
        .then(res => {
            return res.data
        })
        .catch(err => {
            handleError(err)
            throw err
        })
}
/* DELETE */
export function Delete<T>(url: string, data?: any): Promise<T> {
    return ax
        .delete(url, data)
        .then(res => {
            return res.data
        })
        .catch(err => {
            handleError(err)
            throw err
        })
}

