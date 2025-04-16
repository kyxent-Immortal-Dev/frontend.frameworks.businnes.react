import { axiosClient } from "../../axiosClient";


interface loginData {
    email : string,
    password :string
}

export const login = async (data:loginData) => {

    try {
        
        const response = await axiosClient.post("/auth/login", data)

        return response.data

    } catch (error) {
        throw new Error(`${error}`);
        
    }

}