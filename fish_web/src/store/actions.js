import { SelectUserById } from '../api/user_api'
import { SelectAllCategory } from '../api/category'
import { SelectAllArticle, SelectArticleByLike, SelectAllArticleByUser,SelectArticleByType } from '../api/article_api'
import { SelectArticleInfoByUser } from '../api/article_info_api'
import { SelectSettingsByType } from '../api/settings'
import { Message } from 'element-ui'
const actions = {
    //改变用户信息actions
    GetUserInfoById(context, params) {
        SelectUserById(params).then(res => {
            context.commit('changeUserInfo', res.data[0]);
        }).catch(err => {
            console.log(err)
        })
    },
    //所有分类
    SelectAllCategory(context, params) {
        SelectAllCategory(params).then(res => {
            context.commit('changeCategoryList', res.data[0]);
        }).catch(err => {
            console.log(err)
        })
    },

    //更新最新文章列表
    SelectNewArticle(context, params) {
        params.type = '文章'
        SelectArticleByType(params).then(res => {
            context.commit('changeNewArticleList', {data:res.data[0],total:res.data[1][0].total});
        }).catch(err => {
            console.log(err)
        })
    },
    
    //更新最新文章列表
    SelectNewVideo(context, params) {
        params.type = '视频'
        SelectArticleByType(params).then(res => {
            context.commit('changeNewVideoList', {data:res.data[0],total:res.data[1][0].total});
        }).catch(err => {
            console.log(err)
        })
    },

    //更新热门文章列表
    SelectHowArticle(context, params) {
        params.type = '文章'
        SelectArticleByType(params).then(res => {
            context.commit('changeHotArticleList',  {data:res.data[0],total:res.data[1][0].total});
        }).catch(err => {
            console.log(err)
        })
    },
    //更新所有文章列表
    SelectAllArticle(context, params) {
        SelectAllArticle(params).then(res => {
            context.commit('changeArticleList',  {data:res.data[0],total:res.data[1][0].total});
        }).catch(err => {
            console.log(err)
        })
    },
    GetArticleListByUser(context, params) {
        SelectArticleByType(params).then(res => {
            context.commit('changeUserArticleList', { data: res.data[0], total: res.data[1][0].total });
        }).catch(err => {
            console.log(err)
        })
    },
    GetCollectList(context, params) {
        SelectArticleInfoByUser(params).then(res => {
            let data = res.data.filter(i => {
                return i.info_type == params.type
            })
            context.commit('changeCollectList', { data: data, total: data.length || 0 });
        }).catch(err => {
            console.log(err)
        })
    },
    //更新查询结果列表
    SelectArticleReuslt(context, params) {
        SelectArticleByLike(params).then(res => {
            context.commit('changeArticleResult',  {data:res.data[0],total:res.data[1][0].total});
        }).catch(err => {
            console.log(err)
        })
    },
    //更新轮播图列表
    SelectRotationImg(context, params) {
        SelectSettingsByType(params).then(res => {
            context.commit('changeRotationImgList',  {data:res.data[0],total:res.data[1][0].total});
        }).catch(err => {
            console.log(err)
        })
    },
    //更新公告列表
    SelectAnnouncement(context, params) {
        SelectSettingsByType(params).then(res => {
            context.commit('changeAnnouncementList',  {data:res.data[0],total:res.data[1][0].total});
        }).catch(err => {
            console.log(err)
        })
    },

}

export default actions