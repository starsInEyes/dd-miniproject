import { ddget } from './http'

// 测试
export const testApi = p => ddget('/cfin/getWuYeCfin', p);
// 物业费
export const getMonthApi = p => ddget('/cfin/getShouldAndCollectedMonth', p);
export const getShouldApi = p => ddget('/cfin/getShouldAndCollected', p);
export const getList = p => ddget('/cfin/getCfinList', p);
// 停车费
export const getParkingToday = p => ddget('/cfin/getCarFees', p);
export const getParkingProgress = p => ddget('/cfin/getCarFeeList', p);
