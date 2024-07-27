import { useContext } from "react";
import { DataContext } from "../provider/DataProvider";

const useData =()=> useContext(DataContext)

   
export default useData; 