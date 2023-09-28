import { message } from "antd";

/*global chrome */
const editorExtensionId = "ookgnahfklmejhicejjbfjifppjbfnlk";

const reqAPI = async (url, method, header, body) => {
    try {
        const response = await new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(editorExtensionId, { method, url, body, header }, resolve);
        });
        if (response) {
            return response;
        } else {
            return '{ "error": "101" }';
        }
    } catch (error) {
        return '{ "error": "101" }';
    }
};

const sendTask = async (message) => {
    try {
        const response = await new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(editorExtensionId, { message }, resolve);
        });
        if (response) {
            return response;
        } else {
            return 'not install';
        }
    } catch (error) {
        return 'not install';
    }
}

async function getAuthFb() {
    let getAuth = localStorage.getItem("getAuth");
    try{
        getAuth = JSON.parse(getAuth)
    }catch{
        getAuth = null
    }

    if (getAuth === null) {
        localStorage.removeItem('getAuth')
        getAuth = await getAuthToken();
        if (!getAuth) {
            return null;
        }
        localStorage.setItem('getAuth', JSON.stringify(getAuth));
        return getMe(getAuth);
    } else {
        getAuth.isStorage = true;
        return getMe(getAuth);
    }
}

async function getMe(getAuth) {
    let url = `https://graph.facebook.com/v15.0/me?access_token=${getAuth.token}`;
    let json = await reqAPI(url, "GET");
    let obj = JSON.parse(json);
    if (obj.error) {
        localStorage.removeItem('getAuth')
        return null;
    }
    getAuth.id = obj.id;
    getAuth.name = obj.name;
    return getAuth;
}

async function getAuthToken() {
    try {
        let url0 = "https://adsmanager.facebook.com/adsmanager/manage/campaigns";
        let url1 = "https://adsmanager.facebook.com/adsmanager/manage/accounts";
        let url2 = "https://adsmanager.facebook.com/adsmanager/manage/accounts?act=";

        var json = await reqAPI(url0, "GET");
        var flag = json.indexOf("__accessToken=");
        var token = "NO";
        var fbdt = "NO";

        if (flag < 0) {
            json = await reqAPI(url1, "GET");
            flag = json.indexOf('adAccountId: \\"');
            if (flag < 0) {
                return {
                    token: token,
                    fbdt: fbdt,
                };
            } else {
                var accadsid = json.split('adAccountId: \\"')[1].split('\\"')[0];
                json = await reqAPI(url2 + accadsid + '&breakdown_regrouping=0', "GET");
                token = json.split('window.__accessToken="')[1].split('"')[0];
                fbdt = json.split('["DTSGInitData",[],{"token":"')[1].split('"')[0];
            }
        } else {
            token = json.split('window.__accessToken="')[1].split('"')[0];
            fbdt = json.split('["DTSGInitData",[],{"token":"')[1].split('"')[0];
        }
        return {
            token: token,
            fbdt: fbdt,
        };
    } catch (error) {
        return null;
    }
}

async function load_data() {
    var authFb = await getAuthFb();
    if (!authFb) {
        return { error: "201" };
    }
    if (authFb.listAd && authFb.listBM && authFb.listPage) {
        return authFb;
    } else {
        const data = await Promise.all([
            getAdaccounts(authFb),
            getBusiness(authFb),
            getListPage(authFb),
        ]);
        authFb.listAd = data[0];
        authFb.listBM = data[1];
        authFb.listPage = data[2];

        localStorage.setItem('getAuth', authFb);
        return authFb;
    }
}

async function reload_data() {
    localStorage.removeItem('getAuth')
    var authFb = await getAuthFb();
    if (!authFb) {
        return { error: "201" };
    }
    if (authFb.listAd && authFb.listBM && authFb.listPage) {
        return authFb;
    } else {
        const data = await Promise.all([
            getAdaccounts(authFb),
            getBusiness(authFb),
            getListPage(authFb),
        ]);
        authFb.listAd = data[0];
        authFb.listBM = data[1];
        authFb.listPage = data[2];
        localStorage.setItem('getAuth', JSON.stringify(authFb));
        return authFb;
    }
}

async function create_ad_account(bm, name, currency, timezone) {
    var authFb = await getAuthFb();
    if (!authFb) {
        return { error: "201" };
    }

    let url = `https://graph.facebook.com/v14.0/${bm}/adaccount?access_token=${authFb.token}&__cppo=1`;

    let body = {
        name: name,
        currency: currency,
        end_advertiser: bm,
        media_agency: 'UNFOUND',
        partner: 'UNFOUND',
        timezone_id: timezone,
    }
    let response = await reqAPI(url, "POST", {}, body);
    let obj = JSON.parse(response);
    let result = "";
    if ("id" in obj) {
        result = "Tạo thành công " + obj.id;
    }
    if ("error" in obj) {
        result = "Sảy ra lỗi| " + obj.error.message;
    }
    return result;
}

// lấy danh sách tài khoản quảng cáo ( id, status, accout type)
async function getAdaccounts(authFb) {
    let url = `https://graph.facebook.com/v15.0/me/adaccounts?fields=account_id,owner_business,name,disable_reason,account_status,currency,adspaymentcycle,account_currency_ratio_to_usd,adtrust_dsl,balance,all_payment_methods{pm_credit_card{display_string,exp_month,exp_year,is_verified}},created_time,next_bill_date,timezone_name,amount_spent,timezone_offset_hours_utc,insights.date_preset(maximum){spend},userpermissions{user,role},owner,is_prepay_account,spend_cap&summary=true&limit=100&access_token=${authFb.token}`;
    let res = await reqAPI(url, "GET");
    var json = JSON.parse(res);
    if ("error" in json) {
        url = url.replace(/,is_prepay_account/g, "");
        res = await reqAPI(url, "GET");
        json = JSON.parse(res);
    }
    if ("error" in json) {
        url = url.replace(
            /,all_payment_methods{pm_credit_card{display_string,exp_month,exp_year,is_verified}}/g,
            ""
        );
        res = await reqAPI(url, "GET");
        json = JSON.parse(res);
    }
    let objListACC = json.data;
    var tempNext = json.paging;
    var obj
    while ("next" in tempNext) {
        var urlNext = tempNext.next;
        json = await reqAPI(urlNext, "GET");
        obj = JSON.parse(json);
        objListACC = objListACC.concat(obj.data);
        tempNext = obj.paging;
    }
    var arrAcc = [];
    for (const [index, acc] of objListACC.entries()) {
        var objAcc = {
            stt: 0,
            status: "",
            id: "null",
            name: "",
            balance: "",
            threshold: "*",
            adtrust: "",
            spent: "",
            admin: "",
            currency: "",
            acctype: "",
            h_balance: "",
            h_threshold: "*",
            h_adtrust: "",
            h_spent: "",
            h_rate: "",
            role: "",
            bm: "",
            card: "",
            timezone: "",
            adminarray: [],
        };
        var usd_rate = acc.account_currency_ratio_to_usd;
        objAcc.h_rate = usd_rate;
        objAcc.stt = index + 1;
        objAcc.status = getStatusAcc(acc.account_status);
        objAcc.id = acc.account_id;
        objAcc.name = acc.name;
        objAcc.balance = coverCurrency(acc.balance, acc.currency);
        if (acc.adspaymentcycle) {
            let threshold = acc.adspaymentcycle.data[0].threshold_amount;
            threshold = coverCurrency(threshold, acc.currency);
            objAcc.threshold = threshold;
        } else {
            objAcc.threshold = "-";
        }
        objAcc.adtrust =
            acc.adtrust_dsl === -1
                ? "No limit"
                : coverCurrency(acc.adtrust_dsl, "round");
        let spend = acc.insights ? acc.insights.data[0].spend : 0;
        objAcc.spent = coverCurrency(spend, "round");
        let arryUser = acc.userpermissions["data"];
        var countAdminHide = 0;
        arryUser.map((obj) => {
            if (!("user" in obj)) {
                countAdminHide++;
            }
        });
        objAcc.admin = `${arryUser.length} (${countAdminHide})`;
        objAcc.adminarray = [...arryUser];
        objAcc.currency = acc.currency;
        objAcc.acctype = acc.owner_business ? "business" : "personal";
        objAcc.h_balance = coverCurrency(objAcc.balance / usd_rate, "round");
        objAcc.h_threshold = !isNaN(objAcc.threshold)
            ? coverCurrency(objAcc.threshold / usd_rate, "round")
            : "-";
        objAcc.h_adtrust =
            objAcc.adtrust !== "No limit"
                ? coverCurrency(objAcc.adtrust / usd_rate, "round")
                : "No Limit";
        objAcc.h_spent = coverCurrency(objAcc.spent / usd_rate, "round");
        var objRole = acc.userpermissions.data;
        var role = "";
        for (var member of objRole) {
            var id = member.user ? member.user.id : "none";
            if (id === authFb.id) {
                switch (member.role) {
                    case "ADMIN":
                        role = "admin";
                        break;
                    case "REPORTS_ONLY":
                        role = "analyst";
                        break;
                    case "GENERAL_USER":
                        role = "advertisers";
                        break;
                    default:
                        role = member.role;
                }
                break;
            }
        }
        objAcc.role = role;
        objAcc.bm = acc.owner_business ? acc.owner_business.id : "";
        var card = "";
        if (acc.iprepay_account) {
            card = "Trả Trước";
        } else if (acc.all_payment_methods) {
            var cardInfo = acc.all_payment_methods.pm_credit_card.data[0];
            card = `${cardInfo.display_string} (${cardInfo.exp_month}/${cardInfo.exp_year})`;
        }
        objAcc.timezone = `${acc.timezone_offset_hours_utc < 0
            ? acc.timezone_offset_hours_utc
            : `+${acc.timezone_offset_hours_utc}`
            } | ${acc.timezone_name}`;
        objAcc.card = card;
        arrAcc.push(objAcc);
    }
    return arrAcc;
}

//láy id tkqc
async function getidtkqc(token) {
    let url = `https://graph.facebook.com/v15.0/me/adaccounts?fields=account_id,owner_business,name,disable_reason,account_status,currency,adspaymentcycle,account_currency_ratio_to_usd,adtrust_dsl,balance,all_payment_methods{pm_credit_card{display_string,exp_month,exp_year,is_verified}},created_time,next_bill_date,timezone_name,amount_spent,timezone_offset_hours_utc,insights.date_preset(maximum){spend},userpermissions{user,role},owner,is_prepay_account,spend_cap&summary=true&limit=100&access_token=${token}`;
    let res = await reqAPI(url, "GET");
    var json = JSON.parse(res);
    return json;
}
async function get_bm_select() {
    var authFb = await getAuthFb();
    if (!authFb) {
        return { error: "201" };
    }

    if (authFb.listBMCreate) {
        return authFb.listBMCreate;
    }

    var arrBM = [];
    var url = `https://graph.facebook.com/v15.0/me/businesses?fields=id,can_create_ad_account,owned_ad_accounts{id,currency,timezone_id}&access_token=${authFb.token}`;

    var json = await reqAPI(url, "GET");
    var obj = JSON.parse(json);
    var tempNext = obj.paging;
    var objList = obj.data;
    if (objList.length === 0) {
        authFb.listBM = arrBM;
        return arrBM;
    }
    while ("next" in tempNext) {
        var urlNext = tempNext.next;
        json = await reqAPI(urlNext, "GET");
        obj = JSON.parse(json);
        objList = objList.concat(obj.data);
        tempNext = obj.paging;
    }

    var fetches = [];
    for (let bm of objList) {
        var objTemp = {
            id: bm.id,
            can_create_ad_account: bm.can_create_ad_account,
            adaccount: bm.owned_ad_accounts.data.length,
            currency: bm.owned_ad_accounts.data[0].currency,
            timezone: bm.owned_ad_accounts.data[0].timezone_id,
            lv: 0,
        };
        fetches.push(getBmlimit(bm.id, authFb.fbdt));
        arrBM.push(objTemp);
    }
    await Promise.all(fetches).then(function (obj) {
        obj.forEach((limit, index) => {
            arrBM[index].lv = limit;
        });
    });
    authFb.listBMCreate = arrBM;
    localStorage.setItem('getAuth', JSON.stringify(authFb));
    return arrBM;
}

async function getBmlimit(idBm, fbdt) {
    let url = `https://business.facebook.com/business/adaccount/limits/?business_id=${idBm}&__a=1&fb_dtsg=${fbdt}`;
    let json = await reqAPI(url, "POST");
    var levelBM = 1;
    try {
        let bmLimit = json.split('adAccountLimit":')[1].split("}")[0];
        levelBM = Number(bmLimit);
    } catch { }
    return levelBM;
}

async function getBusinessInfo() {
    var authFb = await getAuthFb();
    if (!authFb) {
        return { error: "201" };
    }
    var arrBM = [];
    var url = `https://graph.facebook.com/v15.0/me/businesses?fields=can_create_ad_account,owned_ad_accounts{id,currency,timezone_id}&access_token=${authFb.token}`;

    var json = await reqAPI(url, "GET");
    var obj = JSON.parse(json);
    var tempNext = obj.paging;
    var objList = obj.data;
    if (objList.length === 0) {
        authFb.listBM = arrBM;
        return arrBM;
    }
    while ("next" in tempNext) {
        var urlNext = tempNext.next;
        json = await reqAPI(urlNext, "GET");
        obj = JSON.parse(json);
        objList = objList.concat(obj.data);
        tempNext = obj.paging;
    }
    console.log(objList);
}

// Lấy tất cả tài khoản business (fields id)
async function getBusiness(authFb) {
    var arrBM = [];
    var url = `https://graph.facebook.com/v15.0/me/businesses?fields=id,created_time,is_disabled_for_integrity_reasons,sharing_eligibility_status,allow_page_management_in_www,can_use_extended_credit,name,timezone_id,timezone_offset_hours_utc,verification_status,owned_ad_accounts{id,currency,timezone_offset_hours_utc,timezone_name}&access_token=${authFb.token}`;
    var json = await reqAPI(url, "GET");
    var obj = JSON.parse(json);
    var tempNext = obj.paging;
    var objList = obj.data;
    if (objList?.length === 0) {
        authFb.listBM = arrBM;
        return arrBM;
    }
    while ("next" in tempNext) {
        var urlNext = tempNext.next;
        json = await reqAPI(urlNext, "GET");
        obj = JSON.parse(json);
        objList = objList.concat(obj.data);
        tempNext = obj.paging;
    }
    for (const [index, bm] of objList.entries()) {
        var objBM = {
            stt: 0,
            status: null,
            id: null,
            name: null,
            levelBm: "•",
            admin: "•",
            limit: null,
            verified: false,
            datecreate: null,
        };
        objBM.stt = index + 1;
        for (var info in bm) {
            switch (info) {
                case "id":
                    objBM.id = bm[info];
                    break;
                case "name":
                    objBM.name = bm[info];
                    break;
                case "allow_page_management_in_www":
                    if (bm[info]) {
                        objBM.status = "active";
                    } else {
                        objBM.status = "disable";
                    }
                    break;
                case "can_use_extended_credit":
                    if (bm[info]) {
                        objBM.limit = "350";
                    } else {
                        objBM.limit = bm[info];
                    }
                    break;
                case "created_time":
                    objBM.datecreate = bm[info].slice(0, 10);
                    break;
                default:
                    break;
            }
        }
        arrBM.push(objBM);
    }
    return arrBM;
}


// Lấy tất cả tài khoản business (fields id)
async function getBusiness_id(authFb) {
    var arrBM = [];
    var url = `https://graph.facebook.com/v15.0/me/businesses?fields=id,created_time,is_disabled_for_integrity_reasons,sharing_eligibility_status,allow_page_management_in_www,can_use_extended_credit,name,timezone_id,timezone_offset_hours_utc,verification_status,owned_ad_accounts{id,currency,timezone_offset_hours_utc,timezone_name}&access_token=${authFb.token}`;
    var json = await reqAPI(url, "GET");
    var obj = JSON.parse(json);
    var tempNext = obj.paging;
    var objList = obj.data;
    if (objList?.length === 0) {
        authFb.listBM = arrBM;
        return arrBM;
    }
    while ("next" in tempNext) {
        var urlNext = tempNext.next;
        json = await reqAPI(urlNext, "GET");
        obj = JSON.parse(json);
        objList = objList.concat(obj.data);
        tempNext = obj.paging;
    }
    for (const [index, bm] of objList.entries()) {
        var objBM = {
            stt: 0,
            status: null,
            id: null,
            name: null,
            levelBm: "•",
            admin: "•",
            limit: null,
            verified: false,
            datecreate: null,
        };
        objBM.stt = index + 1;
        for (var info in bm) {
            switch (info) {
                case "id":
                    objBM.id = bm[info];
                    break;
                case "name":
                    objBM.name = bm[info];
                    break;
                case "allow_page_management_in_www":
                    if (bm[info]) {
                        objBM.status = "active";
                    } else {
                        objBM.status = "disable";
                    }
                    break;
                case "can_use_extended_credit":
                    if (bm[info]) {
                        objBM.limit = "350";
                    } else {
                        objBM.limit = bm[info];
                    }
                    break;
                case "created_time":
                    objBM.datecreate = bm[info].slice(0, 10);
                    break;
                default:
                    break;
            }
        }
        arrBM.push(objBM);
    }
    return arrBM;
}
async function load_business(getAuth) {
    var tokenEAAG = await getTokenEAAG(getAuth.listBM[0].id);
    getAuth.tokenEAAG = tokenEAAG;
    var fetches = [];
    for (var b of getAuth.listBM) {
        let idbm = b["id"];
        fetches.push(getBmlimit(idbm, getAuth.fbdt));
        fetches.push(getAdminHide(idbm, getAuth.token, tokenEAAG));
    }
    let arrLoadBm = await Promise.all(fetches).then(function (arr) {
        return arr;
    });

    var index = 0;
    for (let i = 0; i <= arrLoadBm.length - 1; i += 2) {
        getAuth.listBM[index].levelBm = arrLoadBm[i];
        getAuth.listBM[index].admin = arrLoadBm[i + 1];
        index++;
    }

    localStorage.setItem('getAuth', JSON.stringify(getAuth));
    return getAuth.listBM;
}

async function CheckAdminhideEAAG(idbm, tokenEAAG) {
    let url =
        "https://graph.facebook.com/v14.0/" +
        idbm +
        "/business_users?access_token=" +
        tokenEAAG +
        "&fields=id";
    let json = await reqAPI(url, "GET");
    let obj = JSON.parse(json);
    let objList = obj.data;
    return objList.length;
}

async function CheckAdminhideEAAB(idbm, token) {
    let url =
        "https://graph.facebook.com/v14.0/" +
        idbm +
        "/business_users?access_token=" +
        token +
        "&fields=id";
    let json = await reqAPI(url, "GET");
    let obj = JSON.parse(json);
    let objList = obj.data;
    return objList.length;
}

async function getTokenEAAG(idBm) {
    try {
        let url =
            "https://business.facebook.com/settings/people/" +
            idBm +
            " ?business_id=" +
            idBm;
        let json = await reqAPI(url, "GET");
        let token = json.split('accessToken":"')[2].split('"')[0];
        return token;
    } catch (error) {
        return "Token EAAG Error";
    }
}

async function getAdminHide(idbm, token, tokenEAAG) {
    let countAdminEAAG = await CheckAdminhideEAAG(idbm, tokenEAAG);
    let countAdminEAAB = await CheckAdminhideEAAB(idbm, token);
    var countAdminHide = countAdminEAAB - countAdminEAAG;
    let result = `${countAdminEAAB} (${countAdminHide})`;
    return result;
}

async function getListPage(authFb) {
    let url = `https://graph.facebook.com/v15.0/me?fields=accounts.limit(40){id,name,verification_status,is_published,ad_campaign,roles{id, tasks},is_promotable,is_restricted,parent_page,promotion_eligible,fan_count,followers_count,has_transitioned_to_new_page_experience,picture}&access_token=${authFb.token}`;
    let json = await reqAPI(url, "GET");
    let obj = JSON.parse(json);
    var arrFan = [];
    if ("accounts" in obj) {
        let objList = obj.accounts.data;
        var tempNext = obj.accounts.paging;
        while ("next" in tempNext) {
            var urlNext = tempNext.next;
            json = await reqAPI(urlNext, "GET");
            obj = JSON.parse(json);
            objList = objList.concat(obj.data);
            tempNext = obj.paging;
        }
        for (const [index, fan] of objList.entries()) {
            var objFan = {
                stt: 0,
                img: null,
                id: null,
                name: null,
                status: null,
                likecount: null,
                followers: null,
                promotable: null,
            };
            objFan.stt = index + 1;
            for (var f in fan) {
                switch (f) {
                    case "picture":
                        url = fan[f]["data"]["url"];
                        objFan.img = url;
                        break;
                    case "id":
                        objFan.id = fan[f];
                        break;
                    case "name":
                        objFan.name = fan[f];
                        break;
                    case "verification_status":
                        objFan.status = fan[f];
                        break;
                    case "fan_count":
                        objFan.likecount = fan[f];
                        break;
                    case "followers_count":
                        objFan.followers = fan[f];
                        break;
                    case "is_promotable":
                        objFan.promotable = fan[f];
                        break;
                    default:
                        break;
                }
            }
            arrFan.push(objFan);
        }
    }
    return arrFan;
}

async function getCard(act, fbdt) {
    var url = "https://business.facebook.com/api/graphql/";
    var body = {
        variables: `{"paymentAccountID":"${act}"}`,
        doc_id: '5369940383036972',
        fb_dtsg: fbdt
    }
    let response = await reqAPI(url, 'POST', {}, body);
    let objJson = JSON.parse(response);
    var listCard = "";
    var id_act = "";
    var obj = {};
    if ("data" in objJson) {
        let objCard = "";
        try {
            id_act =
                objJson["data"]["billable_account_by_payment_account"][
                "billing_payment_account"
                ]["id"];
            objCard =
                objJson["data"]["billable_account_by_payment_account"][
                "billing_payment_account"
                ]["billing_payment_methods"];
        } catch (e) {
            obj = {
                id: act,
                payment: listCard,
            };
            return obj;
        }
        for (var card of objCard) {
            var usability = card["usability"];
            switch (usability) {
                case "USABLE":
                    usability = "Usable";
                    break;
                case "UNVERIFIED_OR_PENDING_AUTH":
                    usability = "Need";
                    break;
                case "UNVERIFIABLE":
                    usability = "Unverifiable";
                    break;
                case "ADS_PAYMENTS_RESTRICTED":
                    usability = "Restricted";
                    break;
                default:
                    break
            }
            card = card["credential"];
            if (card["__typename"] === "ExternalCreditCard") {
                listCard +=
                    card["card_association_name"] +
                    " " +
                    card["last_four_digits"] +
                    ": " +
                    usability +
                    " | Expires on: " +
                    card["expiry_month"] +
                    "/" +
                    card["expiry_year"] +
                    "\n";
            } else if (card["__typename"] === "DirectDebit") {
                listCard += "Banking(DirectDebit): " + usability + "\n ";
            } else if (
                card["__typename"] === "AdsToken" ||
                card["__typename"] === "StoredBalance"
            ) {
            } else {
                listCard += "(" + card["__typename"] + ": " + usability + "\n ";
            }
        }
    } else if ("errors" in objJson) {
        listCard = objJson["errors"][0]["message"];
        obj = {
            id: act,
            payment: listCard,
        };
        return obj;
    }
    obj = {
        id: id_act,
        payment: listCard.indexOf("\n")
            ? listCard.slice(0, listCard.length - 1)
            : listCard,
    };
    return obj;
}

async function getBills(act, fbdt) {
    var url = "https://business.facebook.com/api/graphql/";
    let body = {
        fb_dtsg: fbdt,
        variables: `{"count":20,"cursor":null,"end_time":${Math.round(+new Date() / 1000)},"filters":[],"start_time":1339261200,"id":"${act}"}`,
        doc_id: '5088279497901543'
    }
    let response = await reqAPI(url, 'POST', {}, body);
    let objJson = JSON.parse(response);
    var objData = {};
    let txt_bill = "";
    try {
        objData = objJson["data"]["node"]["billing_txns"]["edges"];
        if (objData.length > 0) {
            var count_paid = 0;
            var count_faild = 0;
            for (var bills of objData) {
                let objBill = bills.node;
                txt_bill +=
                    (objBill.status === "COMPLETED" ? "✓ PAID" : objBill.status) +
                    " | " +
                    objBill.payment_method_label +
                    " | " +
                    " | " +
                    new Date(objBill.transaction_time * 1000).toLocaleDateString(
                        "en-US"
                    ) +
                    " | " +
                    objBill.total_amount.formatted_amount +
                    "\n";
                if (objBill.status === "COMPLETED") {
                    count_paid++;
                } else {
                    count_faild++;
                }
            }
            txt_bill = `( ${objData.length} Bills gần nhất | Paid: ${count_paid} | Faild: ${count_faild} ) Export by sMeta.vn* \n ${txt_bill}`;
        }
    } catch (ex) {
        if ("errors" in objJson) {
            txt_bill = objJson["errors"][0]["message"];
        }
    }
    return txt_bill;
}


async function getPayment(act, fbdt) {
    let objPayment = await getCard(act, fbdt);
    let bills = await getBills(objPayment.id, fbdt);

    var obj = {
        act: act,
        payments: objPayment.payment,
        bills: bills,
    };
    return obj;
}

async function export_ex() {
    var authFb = await getAuthFb();
    if (!authFb) {
        return { error: "201" };
    }

    let objAds = authFb.listAd;
    let objBM = authFb.listBM;

    let objPayment = authFb.objPayment;

    if (!objPayment || objPayment.length === 0) {
        var fbdt = authFb.fbdt;
        authFb.objPayment = []
        localStorage.setItem('getAuth', JSON.stringify(authFb));
        var fetches = [];
        for (var acc of objAds) {
            fetches.push(getPayment(acc.id, fbdt));
        }
        var arrs = await Promise.all(fetches).then(function (obj) {
            return obj;
        });
        authFb.objPayment = arrs
        localStorage.setItem('getAuth', JSON.stringify(authFb));
        objPayment = arrs;
    }

    for (let acc of objAds) {
        for (var subacc of objPayment) {
            if (acc.id === subacc.act) {
                acc.card = subacc.payments;
                acc.bills = subacc.bills;
                break;
            }
        }
    }

    var arrAds = [
        [
            "STT",
            "Trạng Thái",
            "Id Tk",
            "Tên TK",
            "Dư nợ",
            "Ngưỡng",
            "Limit",
            "Chi tiêu",
            "Admin",
            "Tiền tệ",
            "Loại TK",
            "Role",
            "Bill",
            "Id BM",
            "Payment",
            "Time Zone",
        ],
    ];
    var arrBM = [
        [
            "STT",
            "Trạng Thái",
            "Id Bm",
            "Tên BM",
            "BM level",
            "Admin ẩn",
            "Limit",
            "Múi giờ",
            "Ngày tạo",
        ],
    ];

    for (let acc of objAds) {
        let arrContent = [];
        for (var info in acc) {
            if (info.slice(0, 2) !== "") {
                arrContent.push(acc[info]);
            }
        }
        var bills = acc["bills"];
        bills = bills.split("*")[0];
        // arrContent.splice(1, 0, acc['s_bm'])
        arrContent.splice(12, 0, bills);
        arrAds.push(arrContent);
    }

    for (let acc of objBM) {
        let arrContent = [];
        for (let info in acc) {
            if (info !== "pixel") {
                arrContent.push(acc[info]);
            }
        }
        arrBM.push(arrContent);
    }

    return {
        objAds,
        arrAds,
        objBM,
        arrBM,
    };
}

function getStatusAcc(num) {
    let astatus = "";
    switch (num) {
        case 1:
            astatus = "active";
            break;
        case 2:
            astatus = "disable";
            break;
        case 3:
            astatus = "needPay";
            break;
        case 7:
            astatus = "review";
            break;
        case 8:
            astatus = "settlement";
            break;
        case 9:
            astatus = "period";
            break;
        case 100:
            astatus = "closure";
            break;
        case 101:
            astatus = "close";
            break;
        case 201:
            astatus = "anyActive";
            break;
        case 202:
            astatus = "anyClose";
            break;
        default:
            astatus = "Unknow";
            break;
    }
    return astatus;
}

function coverCurrency(num, currency) {
    num = +num;
    if (currency === "round") {
        return Math.round((num + Number.EPSILON) * 10) / 10;
    }
    let arr = [
        "CLP",
        "COP",
        "CRC",
        "HUF",
        "ISK",
        "IDR",
        "JPY",
        "KRW",
        "PYG",
        "TWD",
        "VND",
    ];
    let currencies = 100;
    if (arr.includes(currency)) {
        currencies = 1;
    }
    return Math.round((num / currencies + Number.EPSILON) * 10) / 10;
}

async function deleteAdminAD(id, user_id, token) {
    let url = `https://graph.facebook.com/v15.0/act_${id}/users?uid=${user_id}&access_token=${token}`;
    let body = {
        method: 'delete'
    }
    let res = await reqAPI(url, "POST", {}, body);
    let obj = JSON.parse(res);
    return obj;
}

async function getAdminADhire(id, bm) {
    var url = `
    https://adsmanager.facebook.com/ads/manager/account_settings/information/?act=${id}`;
    if (bm !== "") {
        url = `https://business.facebook.com/ads/manager/account_settings/information/?act=${id}&business_id=${bm}`;
    }
    let res = await reqAPI(url, "GET");
    let textSplit = res.split("accountUsers:")[1].split(",adColumnSizes")[0];
    let json = textSplit.replace(/([a-zA-Z0-9]+?):/g, '"$1":');
    let arr = JSON.parse(json);
    var arrResult = [];
    for (var user of arr) {
        var obj = {};
        obj.id = user.id;
        obj.name = user.name ? user.name : "Ẩn danh";
        if (user.role === 281423141961500) {
            obj.role = "admin";
        } else if (user.role === 461336843905730) {
            obj.role = "analyst";
        } else if (user.role === 498940650138739) {
            obj.role = "advertisers";
        } else {
            obj.role = "unknown";
        }
        obj.isAdminHide = user.name ? false : true;
        arrResult.push(obj);
    }
    return arrResult;
}

async function getListAdminBmHide(id) {
    var authFb = await getAuthFb();
    if (!authFb) {
        return { error: "201" };
    }
    let token = authFb.token;
    let tokenEAAG = authFb.tokenEAAG;
    let url = `https://graph.facebook.com/v14.0/${id}/business_users?&fields=first_name,last_name,id,role`;
    let resEAAB = await reqAPI(url + `&access_token=${token}`, "GET");
    let resEAAG = await reqAPI(url + `&access_token=${tokenEAAG}`, "GET");
    let jsonEAAB = JSON.parse(resEAAB);
    let jsonEAAG = JSON.parse(resEAAG);

    let adminEAAB = jsonEAAB.data;
    let adminEAAG = jsonEAAG.data;
    const ids = adminEAAG.map((e) => e.id);
    var arrResult = [];
    for (let user of adminEAAB) {
        let obj = {};
        obj.id = user.id;
        obj.name = `${user.first_name} ${user.last_name}`;
        obj.role = user.role;
        obj.isAdminHide = !ids.includes(user.id);
        arrResult.push(obj);
    }
    return arrResult;
}

async function getpixelBM(idbm, token) {
    let url = `https://graph.facebook.com/v15.0/${idbm}?fields=owned_pixels{id,name}&access_token=${token}`;
    let json = await reqAPI(url, "GET");
    let obj = JSON.parse(json);
    return obj;
}

async function SharePixel(token, idBm, idPixel, idAds) {
    var url = "https://graph.facebook.com/v15.0/" + idPixel + "/shared_accounts";
    let body = {
        account_id: idAds,
        business: idBm,
        access_token: token,
    }
    let response = await reqAPI(url, "POST", {}, body);
    let obj = JSON.parse(response);
    const data = { obj, idBm, idPixel, idAds };
    return data;
}

async function SharePixel_one(token, idBm, idPixel, listidAds) {
    let res = await SharePixel(token, idBm, idPixel, listidAds);
    return res;
}

async function getToken() {
    let url0 = "https://www.facebook.com/adsmanager/manage/campaigns";
    let url1 = "https://business.facebook.com/adsmanager/manage/accounts";
    let url2 = "https://business.facebook.com/adsmanager/manage/accounts?act=";

    try {
        var json = await reqAPI(url0, "GET");
        var flag = json.indexOf("__accessToken=");
        var token = "NO";
        var fbdt = "NO";
    } catch (error) {
        return {
            token: "ERR",
            fbdt: "ERR",
        };
    }

    if (flag < 0) {
        json = await reqAPI(url1, "GET");
        flag = json.indexOf('adAccountId: \\"');
        if (flag < 0) {
            var obj = {
                token: token,
                fbdt: fbdt,
            };
            return obj;
        } else {
            var accadsid = json.split('adAccountId: \\"')[1].split('\\"')[0];
            json = await reqAPI(url2 + accadsid, "GET");
            token = json.split('window.__accessToken="')[1].split('"')[0];
            fbdt = json.split('["DTSGInitData",[],{"token":"')[1].split('"')[0];
        }
    } else {
        token = json.split('window.__accessToken="')[1].split('"')[0];
        fbdt = json.split('["DTSGInitData",[],{"token":"')[1].split('"')[0];
    }
    obj = {
        token: token,
        fbdt: fbdt,
    };
    localStorage.setItem('getAuth', obj.token);
    return obj;
}

async function ShareAdAcc(token, adacc, user_id, role, log) {
    var url = `https://adsmanager-graph.facebook.com/v15.0/act_${adacc}/users?access_token=${token}`;
    let body = {
        account_id: adacc,
        uid: user_id,
        role: role
    }
    let response = await reqAPI(url, "POST", {}, body);
    let obj = JSON.parse(response);
    const data = { obj: obj, adacc, user_id };
    return data;
}

async function ShareTKQC_one(token, adacc, user_id, role) {
    return await ShareAdAcc(token, adacc, user_id, role);
}

async function deleteAdminBM(id) {
    var authFb = await getAuthFb();
    if (!authFb) {
        return { error: "201" };
    }
    let token = authFb.token
    let body = {
        method: 'delete'
    }
    let url = `https://graph.facebook.com/v15.0/${id}?access_token=${token}`;
    let res = await reqAPI(url, "POST", {}, body);
    let obj = JSON.parse(res);
    return obj;
}

async function renderPixel2(act) {
    let pixel_select = document.getElementById("pixel-select");
    let token = localStorage.getItem("token");
    token = token.token;
    let url = `https://graph.facebook.com/v15.0/act_${act}/adspixels?fields=id,name&access_token=${token}`;
    let json = await reqAPI(url, "GET");
    let objJSON = JSON.parse(json);
    objJSON = objJSON.data;
    var html = "";
    for (var pixel of objJSON) {
        html += `<option value=${pixel.id}>${pixel.name}</option>`;
    }
    if (html === "") {
        pixel_select.innerHTML = `<option>No Pixel</option>`;
        return;
    }
    pixel_select.innerHTML = html;
}

async function renderPixeltkqc(act, token) {
    let url = `https://graph.facebook.com/v15.0/act_${act}/adspixels?fields=id,name&access_token=${token}`;
    let url2 = `https://graph.facebook.com/v15.0/act_${act}?fields=account_currency_ratio_to_usd,currency&access_token=${token}`;
    let json = await reqAPI(url, "GET");
    let json2 = await reqAPI(url2, "GET");

    let obj = JSON.parse(json);
    let usd = JSON.parse(json2);

    return { obj, usd };
}

async function renderpostcamp(page, endpoint) {
    var authFb = await getAuthFb();
    if (!authFb) {
        return { error: "201" };
    }
    let endpointoption = "posts";
    if (endpoint) {
        endpointoption = "ads_posts";
    }
    let url =
        `https://graph.facebook.com/v15.0/${page}/${endpointoption}?fields=call_to_action,message,is_eligible_for_promotion,promotable_id,attachments.limit(10){description,description_tags,media,media_type,target,title,type,subattachments,unshimmed_url,url},likes.summary(total_count),shares,comments.summary(total_count).limit(0)&access_token=` +
        authFb.token;
    let json = await reqAPI(url, "GET");
    let posts = JSON.parse(json);
    return posts;
}

// đã up
async function get_Draft_Id(act, bm) {
    var draft_id = "error";
    var url = `https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=${act}`;
    if (bm !== "") {
        url += `&business_id=${bm}&nav_source=no_referrer`;
    }
    let res = await reqAPI(url, "GET");
    res = res.replace(/\\/g, "");
    try {
        draft_id = res.split('"summary":true,"ad_draft_id":"')[1].split('"')[0];
    } catch (error) { }
    return draft_id;
}

// đã up
async function create_Camp_Draft(draft_id, data) {
    let url = `https://adsmanager-graph.facebook.com/v15.0/${draft_id}/addraft_fragments?access_token=${data.token}`;
    let configCamp = [
        {
            field: "can_use_spend_cap",
            old_value: null,
            new_value: true,
        },
        {
            field: "name",
            old_value: null,
            new_value: data.name,
        },
        {
            field: "metrics_metadata",
            old_value: null,
            new_value: {
                budget_optimization: ["default_on"],
            },
        },
        {
            field: "campaign_group_creation_source",
            old_value: null,
            new_value: "click_quick_create",
        },
        {
            field: "is_odax_campaign_group",
            old_value: null,
            new_value: true,
        },
        {
            field: "special_ad_categories",
            old_value: null,
            new_value: ["NONE"],
        },
        {
            field: "status",
            old_value: null,
            new_value: "ACTIVE",
        },
        {
            field: "special_ad_category",
            old_value: null,
            new_value: "NONE",
        },
        {
            field: "objective",
            old_value: null,
            new_value: "OUTCOME_SALES",
        },
        {
            field: "buying_type",
            old_value: null,
            new_value: "AUCTION",
        },
    ];
    let body = {
        ad_object_type: 'campaign',
        values: JSON.parse(configCamp)
    }
    let response = await reqAPI(url, "POST", {}, body);
    let json = JSON.parse(response);
    try {
        return json.ad_object_id;
    } catch (error) {
        return "error";
    }
}

function getCurrentDateTimeWithOffset() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getSeconds()).padStart(2, "0");
    const timezoneOffset = currentDate.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60)
        .toString()
        .padStart(2, "0");
    const offsetMinutes = (Math.abs(timezoneOffset) % 60)
        .toString()
        .padStart(2, "0");
    const offsetSign = timezoneOffset < 0 ? "+" : "-";

    const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetSign}${offsetHours}${offsetMinutes}`;
    return formattedDateTime;
}

// đã up
async function create_AdGroup_Draft(draft_id, campaign_id, data) {
    let url = `https://adsmanager-graph.facebook.com/v15.0/${draft_id}/addraft_fragments?access_token=${data.token}`;
    const formattedDate = getCurrentDateTimeWithOffset();

    let arr = [
        "CLP",
        "COP",
        "CRC",
        "HUF",
        "ISK",
        "IDR",
        "JPY",
        "KRW",
        "PYG",
        "TWD",
        "VND",
    ];
    if (!arr.includes(data.currency)) {
        data.budget = data.budget * 100;
    }

    var targetAuto = {
        field: "targeting",
        old_value: null,
        new_value: {
            age_max: data.max_age,
            user_device: [],
            excluded_publisher_list_ids: [],
            geo_locations: {
                countries: ["US"],
                location_types: ["home", "recent"],
            },
            genders: data.gender === 0 ? [] : [parseInt(data.gender)],
            age_min: data.min_age,
            excluded_brand_safety_content_types: [],
            excluded_user_device: [],
            wireless_carrier: [],
            user_os: [],
            excluded_geo_locations: {
                regions: [
                    {
                        key: "3844",
                        name: "Alaska",
                        country: "US",
                    },
                    {
                        key: "3854",
                        name: "Hawaii",
                        country: "US",
                    },
                ],
            },
            brand_safety_content_filter_levels: ["FACEBOOK_STANDARD", "AN_STANDARD"],
        },
    };
    var placement = {
        field: "placement",
        new_value: {
            user_device: [],
            excluded_publisher_list_ids: [],
            facebook_positions: ["feed", "facebook_reels", "video_feeds"],
            excluded_brand_safety_content_types: [],
            oculus_positions: [],
            excluded_user_device: [],
            wireless_carrier: [],
            device_platforms: ["mobile", "desktop"],
            user_os: [],
            brand_safety_content_filter_levels: [],
            publisher_platforms: ["facebook"],
        },
    };

    var targetFb = {
        field: "targeting",
        old_value: null,
        new_value: {
            age_max: data.max_age,
            user_device: [],
            excluded_publisher_list_ids: [],
            geo_locations: {
                countries: ["US"],
                location_types: ["home", "recent"],
            },
            facebook_positions: ["feed", "facebook_reels", "video_feeds"],
            genders: data.gender === 0 ? [] : [parseInt(data.gender)],
            age_min: data.min_age,
            excluded_brand_safety_content_types: [],
            oculus_positions: [],
            excluded_user_device: [],
            wireless_carrier: [],
            device_platforms: ["mobile", "desktop"],
            user_os: [],
            excluded_geo_locations: {
                regions: [
                    {
                        key: "3844",
                        name: "Alaska",
                        country: "US",
                    },
                    {
                        key: "3854",
                        name: "Hawaii",
                        country: "US",
                    },
                ],
            },
            brand_safety_content_filter_levels: [],
            publisher_platforms: ["facebook"],
        },
    };

    var configAdSet = [
        {
            field: "optimization_goal",
            old_value: null,
            new_value: "OFFSITE_CONVERSIONS",
        },
        {
            field: "targeting_as_signal",
            new_value: 3,
        },
        {
            field: "parentAdObjectID",
            old_value: null,
            new_value: campaign_id,
        },
        {
            field: "pacing_type",
            new_value: ["standard"],
        },
        {
            field: "start_time",
            old_value: null,
            new_value: formattedDate,
        },
        {
            field: "campaign_id",
            old_value: null,
            new_value: campaign_id,
        },
        {
            field: "daily_budget",
            new_value: data.budget,
        },
        {
            field: "name",
            old_value: null,
            new_value: `${data.name}.`,
        },
        {
            field: "campaign_creation_source",
            old_value: null,
            new_value: "click_quick_create",
        },
        {
            field: "status",
            old_value: null,
            new_value: "ACTIVE",
        },
        {
            field: "bid_strategy",
            new_value: "LOWEST_COST_WITHOUT_CAP",
        },
        {
            field: "billing_event",
            old_value: null,
            new_value: "IMPRESSIONS",
        },
        {
            field: "is_autobid",
            new_value: true,
        },
        {
            field: "promoted_object",
            new_value: {
                pixel_id: data.pixel,
                custom_event_type: "PURCHASE",
            },
        },
        {
            field: "lifetime_budget",
            new_value: 0,
        },
        {
            field: "attribution_spec",
            old_value: null,
            new_value: [
                {
                    event_type: "CLICK_THROUGH",
                    window_days: 7,
                },
                {
                    event_type: "VIEW_THROUGH",
                    window_days: 1,
                },
            ],
        },
        {
            field: "is_average_price_pacing",
            new_value: false,
        },
    ];
    if (data.posistion) {
        configAdSet.push(targetAuto);
    } else {
        configAdSet.push(targetFb);
        configAdSet.push(placement);
    }

    let body = {
        ad_object_type: 'ad_set',
        parent_ad_object_id: campaign_id,
        values: JSON.parse(configAdSet)
    }
    let response = await reqAPI(url, "POST", {}, body);
    let json = JSON.parse(response);
    try {
        return json.ad_object_id;
    } catch (error) {
        return "error";
    }
}

// đã up
async function create_Ads_Draft(draft_id, campaign_id, adset_id, data) {
    let url = `https://adsmanager-graph.facebook.com/v15.0/${draft_id}/addraft_fragments?access_token=${data.token}`;
    let cofigAds = [
        {
            field: "parentAdObjectID",
            old_value: null,
            new_value: adset_id,
        },
        {
            field: "campaign_id",
            old_value: null,
            new_value: campaign_id,
        },
        {
            field: "meta_reward_adgroup_status",
            new_value: "INACTIVE",
        },
        {
            field: "name",
            old_value: null,
            new_value: `${data.name}..`,
        },
        {
            field: "metadata",
            new_value: {
                carousel_style: "others",
            },
        },
        {
            field: "creative",
            old_value: null,
            new_value: {
                object_type: "VIDEO",
                contextual_multi_ads: {
                    eligibility: [
                        "POST_AD_ENGAGEMENT_FEED",
                        "POST_AD_ENGAGEMENT_SEED_AD",
                        "STANDALONE_FEED",
                    ],
                    enroll_status: "OPT_IN",
                },
                degrees_of_freedom_spec: {
                    creative_features_spec: {
                        standard_enhancements: {
                            action_metadata: {
                                type: "DEFAULT",
                            },
                            enroll_status: "OPT_IN",
                        },
                    },
                    degrees_of_freedom_type: "USER_ENROLLED_AUTOFLOW",
                },
                object_story_id: data.post_id,
                facebook_branded_content: {},
                branded_content: {},
            },
        },
        {
            field: "tracking_specs",
            old_value: null,
            new_value: [
                {
                    "action.type": ["offsite_conversion"],
                    fb_pixel: [data.pixel],
                },
            ],
        },
        {
            field: "status",
            old_value: null,
            new_value: "ACTIVE",
        },
        {
            field: "adset_id",
            old_value: null,
            new_value: adset_id,
        },
        {
            field: "display_sequence",
            old_value: null,
            new_value: 0,
        },
        {
            field: "ad_creation_source",
            old_value: null,
            new_value: "click_quick_create",
        },
    ];
    let body = {
        ad_object_type: 'ad',
        parent_ad_object_id: adset_id,
        values: JSON.parse(cofigAds)
    }
    let response = await reqAPI(url, "POST", {}, body);
    let json = JSON.parse(response);
    try {
        return json.ad_object_id;
    } catch (error) {
        return "error";
    }
}

async function upLoad_Video(data) {
    let token = data.token;
    var url = `https://adsmanager-graph.facebook.com/v15.0/act_${data.act_id}/advideos`;
    let body = {
        name: 'sMT',
        file_url: data.url_video,
        access_token: token,

    }
    let response = await reqAPI(url, "POST", {}, body);
    var obj = JSON.parse(response);
    return obj;
}

async function create_Camp(data) {
    let token = data.token;
    var body = {
        name: data.name + ".",
        objective: "OUTCOME_SALES",
        status: "ACTIVE",
        special_ad_categories: "[]",
        access_token: token,
    };

    let url = `https://graph.facebook.com/v15.0/act_${data.act_id}/campaigns`;
    let response = await reqAPI(url, "POST", {}, body);
    let obj = JSON.parse(response);
    return obj;
}

async function upload_Thumb(data) {
    try {
        const response = await fetch(data.url_thumb);
        const arrayBuffer = await response.arrayBuffer();
        const byteArray = new Uint8Array(arrayBuffer);
        // const base64String = btoa(String.fromCharCode.apply(null, byteArray));
        const base64String = btoa(
            new Uint8Array(byteArray).reduce(function (data, byte) {
                return data + String.fromCharCode(byte);
            }, "")
        );
        let url = `https://adsmanager-graph.facebook.com/v15.0/act_${data.act_id}/adimages?access_token=${data.token}`;
        let body = {
            byte: base64String,
            name: 'sMT'
        }

        let res = await reqAPI(url, "POST", {}, body);
        var obj = JSON.parse(res);
        var thumb_link = obj.images.sMT.url;
        return thumb_link;
    } catch (error) {
        return "error";
    }
}

async function create_Ads_Upload_Draft(
    draft_id,
    campaign_id,
    adset_id,
    video_id,
    thumb_url,
    data
) {
    let url = `https://adsmanager-graph.facebook.com/v15.0/${draft_id}/addraft_fragments?access_token=${data.token}`;
    let cofigAds = [
        {
            field: "parentAdObjectID",
            old_value: null,
            new_value: adset_id,
        },
        {
            field: "campaign_id",
            old_value: null,
            new_value: campaign_id,
        },
        {
            field: "meta_reward_adgroup_status",
            old_value: null,
            new_value: "INACTIVE",
        },
        {
            field: "name",
            old_value: null,
            new_value: `${data.name}..`,
        },
        {
            field: "metadata",
            old_value: null,
            new_value: {
                carousel_style: "others",
                ad_standard_enhancements_edit_source: 4,
            },
        },
        {
            field: "creative",
            old_value: null,
            new_value: {
                object_type: "VIDEO",
                object_story_spec: {
                    page_id: data.page_id,
                    video_data: {
                        call_to_action: {
                            type: "SHOP_NOW",
                            value: {
                                link: data.action_link,
                            },
                        },
                        video_id: video_id,
                        image_url: thumb_url,
                        caption_ids: null,
                        video_thumbnail_source: "custom",
                        message: data.content,
                        title: data.title,
                    },
                },
                degrees_of_freedom_spec: {
                    creative_features_spec: {
                        standard_enhancements: {
                            action_metadata: {
                                type: "DEFAULT",
                            },
                            enroll_status: "OPT_IN",
                        },
                        advantage_plus_creative: {
                            enroll_status: "OPT_IN",
                        },
                    },
                    degrees_of_freedom_type: "USER_ENROLLED_AUTOFLOW",
                },
                thumbnail_url: thumb_url,
            },
        },
        {
            field: "tracking_specs",
            old_value: null,
            new_value: [
                {
                    "action.type": ["offsite_conversion"],
                    fb_pixel: [data.pixel],
                },
            ],
        },
        {
            field: "status",
            old_value: null,
            new_value: "ACTIVE",
        },
        {
            field: "adset_id",
            old_value: null,
            new_value: adset_id,
        },
        {
            field: "display_sequence",
            old_value: null,
            new_value: 0,
        },
        {
            field: "ad_creation_source",
            old_value: null,
            new_value: "click_quick_create",
        },
    ];
    let body = {
        ad_object_type: 'ad',
        parent_ad_object_id: adset_id,
        values: JSON.stringify(cofigAds)
    }
    let response = await reqAPI(url, "POST", {}, body);
    let json = JSON.parse(response);
    try {
        return json.ad_object_id;
    } catch (error) {
        return "error";
    }
}

async function create_Ad_creative(data) {
    console.log(data.post_id, " data.post_id");
    let body = {
        access_token: data.token,
        name: "sMt Adcreative",
        object_story_id: `${data.page_id}_${data.post_id}`,
    }
    let url = `https://graph.facebook.com/v15.0/act_${data.act_id}/adcreatives`;
    let response = await reqAPI(url, "POST", {}, body);
    let obj = JSON.parse(response);
    return obj;
}

async function create_Ad_Group(campaign_id, data) {
    // const today = new Date();
    // const day = today.getDate().toString().padStart(2, "0");
    // const month = (today.getMonth() + 1).toString().padStart(2, "0");
    // const year = today.getFullYear();
    // const formattedDate = `${day}-${month}-${year}`;
    var target = {
        age_min: data.min_age,
        age_max: data.max_age,
        genders: [data.gender],
        geo_locations: {
            countries: ["US"],
            location_types: ["home", "recent"],
        },
        excluded_geo_locations: {
            regions: [
                {
                    key: "3844",
                    name: "Alaska",
                    country: "US",
                },
                {
                    key: "3854",
                    name: "Hawaii",
                    country: "US",
                },
            ],
        },
    };
    if (!data.posistion) {
        target.publisher_platforms = ["facebook"];
        target.facebook_positions = ["feed", "video_feeds", "facebook_reels"];
        target.device_platforms = ["mobile", "desktop"];
    }

    let arr = [
        "CLP",
        "COP",
        "CRC",
        "HUF",
        "ISK",
        "IDR",
        "JPY",
        "KRW",
        "PYG",
        "TWD",
        "VND",
    ];
    if (!arr.includes(data.currency)) {
        data.budget = data.budget * 100;
    }

    let body = {
        access_token: data.token,
        status: "ACTIVE",
        name: `${data.name}.`,
        campaign_id: campaign_id,
        // "start_time": formattedDate,
        bid_strategy: "LOWEST_COST_WITHOUT_CAP",
        daily_budget: data.budget,
        billing_event: "IMPRESSIONS",
        optimization_goal: "REACH",
        promoted_object: `{"pixel_id": ${data.pixel},"custom_event_type":"PURCHASE"}`,
        // optimization_goal: "OFFSITE_CONVERSIONS",
        objective: "OUTCOME_SALES",
        targeting: JSON.stringify(target),
        brand_safety_content_filter_levels: ["FACEBOOK_STANDARD"],
    }
    let url = `https://graph.facebook.com/v15.0/act_${data.act_id}/adsets`;
    let response = await reqAPI(url, "POST", {}, body);
    let obj = JSON.parse(response);
    return obj;
}

async function create_Ads(adset_id, adcreative_id, data) {
    let body = {
        access_token: data.token,
        name: `${data.name}..`,
        adset_id: adset_id,
        creative: JSON.stringify({
            "creative_id": adcreative_id
        }),
        status: "ACTIVE"
    }
    let url = `https://graph.facebook.com/v15.0/act_${data.act_id}/ads`
    let response = await reqAPI(url, 'POST', {}, body)
    let obj = JSON.parse(response);
    return obj
}


async function create_Rule(act, id) {
    const TRIGGER_RULE = ["CAMPAIGN", "ADSET", "AD"];
    var fetches = [];
    for (var trig of TRIGGER_RULE) {
        let body = {
            name: "sMT",
            evaluation_spec: JSON.stringify({
                evaluation_type: "SCHEDULE",
                filters: [
                    {
                        field: "campaign.id",
                        operator: "IN",
                        value: [id],
                    },
                    {
                        field: "entity_type",
                        operator: "EQUAL",
                        value: trig,
                    },
                    {
                        field: "time_preset",
                        value: "MAXIMUM",
                        operator: "EQUAL",
                    },
                ],
            }),
            execution_spec: JSON.stringify({
                execution_type: "UNPAUSE",
            }),
            schedule_spec: JSON.stringify({
                schedule_type: "DAILY",
            }),
        };

        fetches.push(pushRule(act, trig, body));
    }
    var arrs = await Promise.all(fetches).then(function (text) {
        return text;
    });
    return ` Tạo rule Bật ${arrs.join(" | ")}`;
}

async function pushRule(act, trig, body) {
    var resText = ''
    var token = localStorage.getItem("token");
    let url = `https://graph.facebook.com/v16.0/act_${act}/adrules_library?access_token=${token}`

    let res = await reqAPI(url, 'POST', {}, body)
    let json = JSON.parse(res)
    if ('error' in json) {
        resText = `${trig}: ${json.error.message}`
    } else {
        resText = `${trig}: Done`
    }
    return resText
}

async function create_Ad_creative_Upload(data, video_id) {
    let token = localStorage.getItem("getAuth");
    let videoData = {
        call_to_action: {
            value: { link: data.action_link },
            type: "SHOP_NOW",
        },
        video_id: video_id,
        title: data.title,
        message: data.content,
        image_url: data.url_thumb,
    };
    var body = {
        name: "adcreative video spec",
        object_story_spec: `{"video_data": ${JSON.stringify(
            videoData
        )}, "page_id": ${data.page_id},}`,
        access_token: token
    };

    let url = `https://graph.facebook.com/v15.0/act_${data.act_id}/adcreatives`;
    let response = await reqAPI(url, "POST", {}, body);
    let obj = JSON.parse(response);
    return obj;
}

const chromeTask = {
    sendTask,
    create_Ad_creative_Upload,
    create_Rule,
    create_Ads,
    create_Ad_Group,
    create_Ad_creative,
    create_Camp,
    create_Ads_Upload_Draft,
    upload_Thumb,
    upLoad_Video,
    create_Ads_Draft,
    create_AdGroup_Draft,
    create_Camp_Draft,
    get_Draft_Id,
    renderpostcamp,
    export_ex,
    renderPixeltkqc,
    getidtkqc,
    ShareTKQC_one,
    getAdminHide,
    getBmlimit,
    getToken,
    SharePixel_one,
    getpixelBM,
    load_data,
    deleteAdminAD,
    getAdminADhire,
    reload_data,
    getBusiness_id,
    getAuthFb,
    get_bm_select,
    create_ad_account,
    load_business,
    getListAdminBmHide,
    deleteAdminBM,
};

export default chromeTask;