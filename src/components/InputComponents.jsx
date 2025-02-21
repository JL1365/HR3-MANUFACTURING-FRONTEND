import React from "react";

const InputComponents = ({ icon: Icon, ...props }) => {
  return (
    <div className="form-control w-full my-4">
      <div className="flex items-center">
        <Icon className="size-5 text-green-500 w-5 h-5 ml-5" />
        <input {...props} className="ml-2 w-60" />
      </div>
    </div>
  );
};

export default InputComponents;
