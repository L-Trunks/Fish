const mutations = {
    changeUserId(state, params) {
        state.userId = params;
    },

    changeUserInfo(state, params) {
        state.userInfo = params;
    },

    changeCategoryList(state, params) {
        state.categoryList = params;
    },

    changeHotArticleList(state, params) {
        state.hotArticleList = params;
    },

    changeNewArticleList(state, params) {
        state.newArticleList = params;
    },

    changeArticleList(state, params) {
        state.articleList = params;
    },

    changeArticleCollectList(state, params) {
        state.articleCollectList = params;
    },
    
    changeRotationImgList(state, params) {
        state.rotationImgList = params;
    },

    changeArticleResult(state, params) {
        state.articleResult = params;
    },

    changeToken(state, params) {
        state.token = params;
    },

    changeIsLogin(state, params) {
        state.isLogin = params;
    },

    changeAnnouncementList(state, params) {
        state.announcementList = params;
    },
    
    changeKeyword(state, params) {
        state.keyword = params;
    }

}

export default mutations