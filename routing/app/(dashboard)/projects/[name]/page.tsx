import React from "react";

const ProjectDetails = ({ params }: { params: { name: string } }) => {
  return (
    <main>
      <h1>Project {params.name}</h1>
    </main>
  );
};

export default ProjectDetails;
