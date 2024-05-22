import React from "react";
import {Spinner} from "@nextui-org/spinner";

export const Loader = () => {
   return(
  <div className="h-full flex flex-col gap-y-4 items-center justify-center">
    <div className="w-10 h-10 relative animate-spin">
    <Spinner />
      ....
    </div>
  </div>
   )
};