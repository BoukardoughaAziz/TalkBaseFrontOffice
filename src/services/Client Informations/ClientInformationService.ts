import { ClientInformation } from '@/models/ClientInformation';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL+'/client-information';

class ClientInformationService {
    async createClientInfo(createClientInformationDto: ClientInformation) {
        const response = await axios.post(`${API_URL}/create-client`, createClientInformationDto);
        return response.data;
    }

    async findClientInfoByIdentifier(identifier: string) {
        console.log("this is the identifier"+identifier)  
        const response = await axios.get(`${API_URL}/find-client-by-identifier/${identifier}`);
        return response.data;
    }

    async findAllClients() {
        const response = await axios.get(`${API_URL}/find-all-clients`);
        return response.data;
    }

    async findClientById(id: string) {
        const response = await axios.get(`${API_URL}/find-client/${id}`);
        return response.data;
    }

    async updateClient(updateClientInformationDto: ClientInformation) {
        const response = await axios.patch(`${API_URL}/update-client/${updateClientInformationDto.identifier}`, updateClientInformationDto);
        return response.data;
    }

    async removeClient(id: string) {
        const response = await axios.delete(`${API_URL}/remove-client/${id}`);
        return response.data;
    }
}

export default new ClientInformationService();