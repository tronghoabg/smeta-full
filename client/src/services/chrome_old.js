/*global chrome */

const editorExtensionId = "ookgnahfklmejhicejjbfjifppjbfnlk";

const sendTask = async (task) => {
  try {
    const response = await new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(editorExtensionId, { task: task }, resolve);
    });
    if (response) {
      return response;
    } else {
      return { error: "101" };
    }
  } catch (error) {
    return { error: "101" };
  }
};

const clear = async () => {
  const res = await sendTask({
    job: "clear",
  });
  return res;
};
const create_ad_account = async (id, name, currency, timezone) => {
  const res = await sendTask({
    job: "create_ad_account",
    id,
    name,
    currency,
    timezone,
  });
  return res;
};

const get_bm_select = async () => {
  const res = await sendTask({
    job: "get_bm_select",
  });
  return res;
};

const checkInstall = async () => {
  const res = await sendTask({
    job: "check_install",
  });
  return res;
};

const HandleSetCamp = async (data) => {
  const res = await sendTask({
    job: "Handle_Set_Camp",
    data,
  });
  return res;
};

const load_data = async () => {
  const list = await sendTask({
    job: "load_data",
  });
  return list;
};

const load_business = async (authFb) => {
  const list = await sendTask({
    job: "load_business",
    authFb,
  });
  return list;
};

const getReload = async () => {
  const list = await sendTask({
    job: "reload",
  });
  return list;
};

const deleteAdminAD = async (ID, userID, token) => {
  const list = await sendTask({
    job: "removeAdminAD",
    ID,
    userID,
    token,
  });
  return list;
};

const deleteAdminBM = async (ID) => {
  const list = await sendTask({
    job: "removeAdminBM",
    ID,
  });
  return list;
};

const getAdminADhire = async (userId, bmId) => {
  const list = await sendTask({
    job: "getAdminADhire",
    userId,
    bmId,
  });
  return list;
};

const getListAdminBmHide = async (bmId) => {
  const list = await sendTask({
    job: "getListAdminBmHide",
    bmId,
  });
  return list;
};

const export_ex = async () => {
  const list = await sendTask({
    job: "export_ex",
  });
  return list;
};

const reload_data = async () => {
  const list = await sendTask({
    job: "reload_data",
  });
  return list;
};

const getBusiness_id = async (authFb) => {
  const list = await sendTask({
    job: "get_Business_id",
    authFb,
  });
  return list;
};

const getAuthFb = async () => {
  const list = await sendTask({
    job: "getAuthFb",
  });
  return list;
};

const getpixelBM = async (idbm, token) => {
  const list = await sendTask({
    job: "get_pixel_bm",
    idbm,
    token,
  });
  return list;
};

const SharePixel_one = async (token, idBm, idPixel, listidAds) => {
  const list = await sendTask({
    job: "Share_Pixel_one",
    token,
    idBm,
    idPixel,
    listidAds,
  });
  return list;
};

const getToken = async () => {
  const list = await sendTask({
    job: "get_token",
  });
  return list;
};

const getBmlimit = async (idBm, fbdt) => {
  const list = await sendTask({
    job: "get_Bm_limit",
    idBm,
    fbdt,
  });
  return list;
};

const getAdminHide = async (idbm, token) => {
  const list = await sendTask({
    job: "Check_Admin_Hide",
    idbm,
    token,
  });
  return list;
};

const ShareTKQC_one = async (token, adacc, user_id, role) => {
  const list = await sendTask({
    job: "Share_TKQC_one",
    token,
    adacc,
    user_id,
    role,
  });
  return list;
};
const getidtkqc = async (token) => {
  const list = await sendTask({
    job: "get_id_tkqc",
    token,
  });
  return list;
};

const renderPixeltkqc = async (act, token) => {
  const list = await sendTask({
    job: "renderPixeltkqc",
    act,
    token,
  });
  return list;
};

const renderpostcamp = async (page, endpoint) => {
  const list = await sendTask({
    job: "render_post_camp",
    page,
    endpoint,
  });
  return list;
};

const get_Draft_Id = async (act_id, act_bm) => {
  const res = await sendTask({
    job: "get_Draft_Id",
    act_id,
    act_bm,
  });
  return res;
};

const create_Camp_Draft = async (draft_id, data) => {
  const res = await sendTask({
    job: "create_Camp_Draft",
    draft_id,
    data,
  });
  return res;
};

const create_AdGroup_Draft = async (draft_id, campaign_id, data) => {
  const res = await sendTask({
    job: "create_AdGroup_Draft",
    draft_id,
    campaign_id,
    data,
  });
  return res;
};

const create_Ads_Draft = async (draft_id, campaign_id, adset_id, data) => {
  const res = await sendTask({
    job: "create_Ads_Draft",
    draft_id,
    campaign_id,
    adset_id,
    data,
  });
  return res;
};

const upLoad_Video = async (data) => {
  const res = await sendTask({
    job: "upLoad_Video",
    data,
  });
  return res;
};

const upload_Thumb = async (data) => {
  const res = await sendTask({
    job: "upload_Thumb",
    data,
  });
  return res;
};

const create_Ads_Upload_Draft = async (
  draft_id,
  campaign_id,
  adset_id,
  AdVideo_id,
  AdThumb,
  data
) => {
  const res = await sendTask({
    job: "create_Ads_Upload_Draft",
    draft_id,
    campaign_id,
    adset_id,
    AdVideo_id,
    AdThumb,
    data,
  });
  return res;
};

const create_Camp = async (data) => {
  const res = await sendTask({
    job: "create_Camp",
    data,
  });
  return res;
};

const create_Ad_creative = async (data) => {
  const res = await sendTask({
    job: "create_Ad_creative",
    data,
  });
  return res;
};

const create_Ad_Group = async (campaign_id, data) => {
  const res = await sendTask({
    job: "create_Ad_Group",
    campaign_id,
    data,
  });
  return res;
};

const create_Ads = async (AdSet_id, adcreative_id, data) => {
  const res = await sendTask({
    job: "create_Ads",
    AdSet_id,
    adcreative_id,
    data,
  });
  return res;
};

const create_Rule = async (act_id, campaign_id) => {
  const res = await sendTask({
    job: "create_Rule",
    act_id,
    campaign_id,
  });
  return res;
};

const create_Ad_creative_Upload = async (data, AdVideo_id) => {
  const res = await sendTask({
    job: "create_Ad_creative_Upload",
    data,
    AdVideo_id
  });
  return res;
};

const chromeTask = {
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
  HandleSetCamp,
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
  checkInstall,
  load_data,
  getReload,
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
  clear,
};

export default chromeTask;
