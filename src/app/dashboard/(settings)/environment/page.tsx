// import PipelineSection from "@/components/PipelineSection";
// import { DndProvider } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";

// const EnvironmentPage = () => {
//   return (
//     <DndProvider backend={HTML5Backend}>
//       <PipelineSection />
//     </DndProvider>
//   );
// };

// export default EnvironmentPage;

import WorkflowWithImageCardsLimited from "@/components/WorkflowBuilder";

const EnvironmentPage = () => {
  return (
    <div>
      <WorkflowWithImageCardsLimited />
    </div>
  );
};

export default EnvironmentPage;
