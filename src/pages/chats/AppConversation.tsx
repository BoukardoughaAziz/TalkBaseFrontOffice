import { AppMap } from "@/components/AppMap";
import { AppClient } from "@/models/AppClient";

export default class AppConversation {
 selectedAppClient?:AppClient;
 currentConversation:AppMap=new AppMap();
}
