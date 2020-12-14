export const API = {
  SETTINGS: '/api/setting',
  ABOUT_APP: '/api/page-contents/type/{0}',

  FILES: '/api/files/{0}',
  IMAGES: "/api/files/image/{0}",
  AVATAR: '/api/get-files/avatar/{0}',

  FAQS: "/api/citizen/faqs",
  FAQS_QUERY: "/api/citizen/faqs?page={0}&limit={1}",
  FAQS_ID: "/api/citizen/faqs/{0}",

  SERVICE: "/api/citizen/service",
  SERVICE_QUERY: "/api/service?page={0}",
  SERVICE_ID: "/api/service/{0}",

  STATUS: "/api/status-request",
  STATUS_QUERY: "/api/status-request?page={0}",
  STATUS_ID: "/api/status-request/{0}",

  COMMENTS: "/api/comments",
  COMMENTS_QUERY: "/api/comments?page={0}",
  COMMENTS_ID: "/api/comments/{0}",

  CITIZEN: "/api/citizen",
  CITIZEN_QUERY: "/api/citizen?page={0}",
  CITIZEN_ID: "/api/citizen/{0}",
  COUNT: "/api/citizen/count",
  DISTRICT: "/api/citizen/district",
  UNIT: "/api/citizen/unit",
  //SERVICE: "/api/citizen/service",
  //CATEGORY: "/api/citizen/service",

  CITIZEN_LOGIN: "/api/citizen/login",
  CITIZEN_LOGIN_GOOGLE: "/api/citizen/login-google",
  CITIZEN_LOGIN_FACEBOOK: "/api/citizen/login-facebook",
  CITIZEN_ME: "/api/citizen/me",
  CITIZEN_INFO: "/api/citizen/info",
  CITIZEN_REGISTER: "/api/citizen/signup",
  CITIZEN_FORGOT_PASSWORD: "/api/citizen/forgot-password-mail",

  CITIZEN_NOTIFY: "/api/citizen-notify?page={0}&limit={1}&created_at[to_time]={2}",

  CITIZEN_REGISTER_DEVICE: "/api/citizen/register-device",
  CITIZEN_UNREGISTER_DEVICE: "/api/citizen/unregister-device",

  REQUEST: "/api/citizen/request",
  REQUEST_QUERY: "/api/citizen/request?page={0}&limit={1}{2}",
  //REQUEST_QUERY: "/api/citizen/request?page={0}&service_id={1}&unit_id={2}&district_id={3}&created_at[from]={4}&created_at[to]={5}",
  REQUEST_ID: "/api/citizen/request/{0}",

  REQUEST_ME: "/api/citizen/request-me",
  REQUEST_ME_QUERY: "/api/citizen/request-by-phone?page={0}&limit={1}{2}",
  //REQUEST_ME_QUERY: "/api/citizen/request-me?page={0}&service_id={1}&unit_id={2}&district_id={3}&created_at[from]={4}&created_at[to]={5}",
  REQUEST_ME_ID: "/api/citizen/request-by-phone/{0}",

  REPORT: "/api/report",
  REQUEST_BY_DISTRICT: "/citizen/request-by-district?{0}",
  REQUEST_BY_SERVICE: "/citizen/request-by-service?{0}",
  REQUEST_BY_ME: "/citizen/request-by-me?{0}{1}",

  RATING: "/api/citizen/citizen-rate",
  RATING_ID: "/api/citizen/citizen-rate/{0}",
  RATING_BY_REQUEST: "/api/citizen/request/{0}/citizen-rate",
  MY_RATING_BY_REQUEST: "/api/citizen/request/{0}/me-rating",

  COMMENT: "/api/citizen/citizen-comment",
  COMMENT_ID: "/api/citizen/citizen-comment/{0}",
  COMMENT_BY_REQUEST: "/api/citizen/request/{0}/citizen-comment",

  MY_FAVORYTE: '/api/citizen-favorited',
  MY_FAVORYTE_QUERY: '/api/citizen-favorited?page={0}&limit={1}{2}',
  MY_FAVORYTE_ID: '/api/citizen-favorited/{0}',

  LIST_MY_POINT_ID: '/api/citizen/{0}/citizen-point?page={1}&limit={2}',

  GIFTS: '/api/citizen/{0}/gifts',
  MY_GIFTS: '/api/citizen/{0}/my-gifts?page={1}&limit={2}',
  REDEEM: '/api/citizen/{0}/redeems',

  HCC: '/api/hcc?page={0}&limit={1}{2}',
  HCC_DETAIL: '/api/hcc/{0}/detail',
  ELICTRIC: '/api/electric/{0}',
  ELICTRIC_DETAIL: '/api/electric/{0}/invoices/{1}',

  NCOVID: '/api/ncovid/all',
  NCOVID_VIETNAM: '/api/ncovid/countries/VN',
  NCOVID_THANHHOA: '/api/dich-benh/last',

  NCOVID_NGUOIKHAI: '/api/citizen/{0}/ncovid-nguoi-khai',

  NCOVID_DANHBA: '/api/ncovid-danhba',
  NCOVID_DANHBA_ID: '/api/ncovid-danhba/{0}',
  NCOVID_DANHBA_QUERY: '/api/ncovid-danhba?page={0}&limit={1}{2}',

  NCOVID_DANHMUCPHANANH: '/api/ncovid-danhmucphananh',
  NCOVID_DANHMUCPHANANH_ID: '/api/ncovid-danhmucphananh/{0}',
  NCOVID_DANHMUCPHANANH_QUERY: '/api/ncovid-danhmucphananh?page={0}&limit={1}{2}',

  NCOVID_PHANANH: '/api/ncovid-phananh',

  NCOVID_DANHMUCKHAIBAO: '/api/ncovid-danhmuckhaibao?chitiet=true',
  NCOVID_DANHMUCKHAIBAO_ID: '/api/ncovid-danhmuckhaibao/{0}',
  NCOVID_DANHMUCKHAIBAO_QUERY: '/api/ncovid-danhmuckhaibao?page={0}&limit={1}{2}',

  NCOVID_KHAIBAO_YTE: '/api/ncovid-khaibaoyte',

  NCOVID_TINTUC: '/api/ncovid-news',
  NCOVID_TINTUC_ID: '/api/ncovid-news/{0}',
  NCOVID_TINTUC_QUERY: '/api/ncovid-news?page={0}&limit={1}{2}',

  THONGTIN_DICHTE_QUERY: '/api/dich-te/tim-kiem?page={0}&limit={1}{2}',

  PROVINCE_QUERY: '/api/province?page={0}&limit={1}{2}',
  DISTRICT_QUERY: '/api/district?page={0}&limit={1}{2}',

  DISTRICT_BY_PROVINCE: '/api/province/{0}/district',
  WARDS_BY_DISTRICT: '/api/district/{0}/wards',

  THONG_BAO: '/api/ncovid-tin-tuc',
  THONG_BAO_ID: '/api/ncovid-tin-tuc/{0}',
  THONG_BAO_QUERY: '/api/ncovid-tin-tuc?page={0}&limit={1}{2}',
  HOLIDAY_QUERY: '/api/holiday?page={0}&limit={1}{2}',

  NCOVID_FAQS: '/api/citizen/faqs',
  NCOVID_FAQS_ID: '/api/citizen/faqs/{0}',
  NCOVID_FAQS_QUERY: '/api/citizen/faqs?page={0}&limit={1}{2}',

  NCOVID_COSOYTE: '/api/ncovid-cosoyte',
  NCOVID_COSOYTE_ID: '/api/ncovid-cosoyte/{0}',
  NCOVID_COSOYTE_QUERY: '/api/ncovid-cosoyte?page={0}&limit={1}{2}',

  THOI_TIET: '/api/thoi-tiet',
  VAN_BAN: '/api/van-ban/{0}',
  GIOI_THIEU_QUERY: '/api/gioi-thieu',

  TIN_TUC: '/api/tin-tuc',
  TIN_TUC_ID: '/api/tin-tuc/{0}',
  TIN_TUC_QUERY: '/api/tin-tuc?page={0}&limit={1}{2}',

  CANH_BAO: '/api/canh-bao',
  CANH_BAO_ID: '/api/canh-bao/{0}',
  CANH_BAO_QUERY: '/api/canh-bao?page={0}&limit={1}{2}',

  HOI_DAP: '/api/hoi-dap',
  HOI_DAP_ID: '/api/hoi-dap/{0}',
  DELETE_HOI_DAP_ID: '/api/hoi-dap/cong-dan/{0}',
  HOI_DAP_QUERY: '/api/hoi-dap/cong-dan?page={0}&limit={1}{2}',

  HUONG_DAN: '/api/huong-dan',
  HUONG_DAN_ID: '/api/huong-dan/{0}',
  HUONG_DAN_QUERY: '/api/huong-dan?page={0}&limit={1}{2}',

  THONGTIN_SAILECH: '/api/thong-tin-sai-lech',
  THONGTIN_SAILECH_ID: '/api/thong-tin-sai-lech/{0}',
  THONGTIN_SAILECH_QUERY: '/api/thong-tin-sai-lech/cong-khai?page={0}&limit={1}{2}',

  XACMINH_THONGTIN: '/api/xac-minh-tin-tuc',
  XACMINH_THONGTIN_ID: '/api/xac-minh-tin-tuc/{0}',
  XACMINH_THONGTIN_QUERY: '/api/xac-minh-tin-tuc/cong-khai?page={0}&limit={1}{2}',
  XACMINH_THONGTIN_CUATOI: '/api/xac-minh-tin-tuc/cong-dan',
  XACMINH_THONGTIN_CUATOI_QUERY: '/api/xac-minh-tin-tuc/cong-dan?page={0}&limit={1}{2}',

  BOSUNG_THONGTIN_ID: '/api/xac-minh-tin-tuc/cong-dan/{0}',

  HOPTHU_CONGDAN: '/api/hop-thu',
  HOPTHU_CONGDAN_ID: '/api/hop-thu/{0}',
  HOPTHU_CONGDAN_QUERY: '/api/hop-thu?page={0}&limit={1}{2}',
}
