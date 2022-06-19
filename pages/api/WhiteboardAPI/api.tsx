import axios from "axios";

const API_PATH : String = "https://retrospective-connectx-server.herokuapp.com/whiteboard"

export async function createCategories(categoryName:string){
    let res = await axios.post(`${API_PATH}/createcatagories`,{
        name:categoryName
    })
}

export async function createRoom( id:string , userName:string , category:string , roomName:string){
    let res = await axios.post(`${API_PATH}/createroom`,{
        member:id,
        memberName:userName,
        catagorie:category,
        roomname:roomName,
    });
    return res.data as string 
}

export async function deleteRoom(category:string , roomId:string){
    let res = await axios.post(`${API_PATH}/deleteroom`,{
        catagorie:category,
        room:roomId,
    })
}

export async function createCategory(categoryName:string){
    return await axios.post(`${API_PATH}/createcatagories`,{
        name:categoryName,
    })
}

export async function editCategory(oldName:string, newName:string){
    return await axios.put(`${API_PATH}/editcatagories`,{
        oldname:oldName,
        newname:newName
    })
}

export async function deleteCategories(categoryName:string) {
    return await axios.post(`${API_PATH}/deleteCatagories`,{
        catagories:categoryName
    })
}
