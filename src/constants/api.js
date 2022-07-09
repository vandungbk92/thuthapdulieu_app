export const API = {
  USERS: '/api/users',
  USERS_LOGIN: '/api/users/login',
  USERS_ME: '/api/users/me',

  NOISOI_TAI: '/api/noi-soi-tai',
  NOISOI_TAI_QUERY: '/api/noi-soi-tai?page={0}&limit={1}{2}',

  NOISOI_HONG: '/api/noi-soi-hong',
  NOISOI_HONG_QUERY: '/api/noi-soi-hong?page={0}&limit={1}{2}',

  SOI_DA: '/api/soi-da',
  SOI_DA_QUERY: '/api/soi-da?page={0}&limit={1}{2}',
  DATASET_QUERY: '/api/dataset?page={0}&limit={1}{2}',

  NGHE_PHOI: '/api/nghe-phoi',
  NGHE_PHOI_QUERY: '/api/nghe-phoi?page={0}&limit={1}{2}',

  BENH_QUERY: '/api/benh?page={0}&limit={1}{2}',
  TRIEUCHUNG_QUERY: '/api/trieu-chung?page={0}&limit={1}{2}',

  TINHTHANH_QUERY: '/api/tinh-thanh?page={0}&limit={1}{2}',
  QUANHUYEN_BY_TINHTHANH: '/api/tinh-thanh/{0}/quan-huyen',
  PHUONGXA_BY_QUANHUYEN: '/api/quan-huyen/{0}/phuong-xa',

  QUAN_LY_DU_LIEU: '/api/quan-ly-du-lieu',
  QUAN_LY_DU_LIEU_QUERY: '/api/quan-ly-du-lieu?page={0}&limit={1}{2}'
};
