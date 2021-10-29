import { Admin } from '../class';

export const checkAdmin = (socketID: string, adminList: Admin[]) => {
	return adminList.some((admin) => admin.socketID === socketID);
};
