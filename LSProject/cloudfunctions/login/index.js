// 云函数：login
const cloud = require('wx-server-sdk');

cloud.init({ 
    env: cloud.DYNAMIC_CURRENT_ENV 
});

exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    
    return {
        openid: wxContext.OPENID || 'test_openid_' + Date.now(),
        appid: wxContext.APPID || 'test_appid',
        unionid: wxContext.UNIONID || '',
    };
};
