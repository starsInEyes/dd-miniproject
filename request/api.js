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
export const getParkingLine = p => ddget('/cfin/getCarCollectedtoday', p);
// 特约服务费
export const getConventionCircle = p => ddget('/cpayment/getSumList', p);
export const getConventionOther = p => ddget('/cfin/getSpecialFeeList', p);

// 团队表现
export const getTeamList = p => ddget('/cfin/getTeamList', p);
export const getWorkData = p => ddget('/cfin/getTeamDetail', p);
export const getProjectLine = p => ddget('/cfin/getDetailCurve', p);
export const getProjectUser = p => ddget('/sysUser/getUserInfo', p);
// 智能预警
export const getUpToStandard = p => ddget('/warning/queryComplianceProject', p);
export const getNotUpToStandard = p => ddget('/warning/queryUnComplianceProLastMon', p);
export const getNoNewIncomeThreeDays = p => ddget('/warning/noIncomeProLastThreeDay', p);
export const getNutsKeepThreeMonths = p => ddget('/warning/unComplianceProLastThreeMon', p);
export const getLessNumGt10 = p => ddget('/warning/diffMoreTenProLastMon', p);