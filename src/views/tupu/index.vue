<template>
  <div>
    <el-tree :data="data"></el-tree>
  </div>
</template>
<script setup lang="ts">
import EOConceptParameters from "./EOConceptParameters.json";

type OrgEoc = {
  Id: number;
  ParameterDefinition_Id: number;
  "ParameterDefinition_Id.Id": number;
  "ParameterDefinition_Id.Name": string;
  Description: string;
  "EOConcept_Id.Id": number;
  "EOConcept_Id.Name": string;
  "EOConcept_Id.Project_Id": number;
  "EOConcept_Id.Project_Id.Id": 4;
  "EOConcept_Id.Project_Id.Name": "ConstraintAnalysis";
  DefaultData_Id: 1;
};

type EocItem = {
  id: string;
  label: string;
  description: string;
  children: EocItem[];
};

class EOConcept {
  private project: Record<string, EocItem> = {};
  private EOConcept = {};

  private EOConceptParameters: OrgEoc[] = [];

  constructor(EOConceptParameters: OrgEoc[]) {
    this.EOConceptParameters = EOConceptParameters;
  }

  parseProject2Tree() {
    this.EOConceptParameters.forEach((item) => {
      const projectId = `project_${item["EOConcept_Id.Project_Id.Id"]}`;
      const projectName = item["EOConcept_Id.Project_Id.Name"];
      const EOConceptName = item["EOConcept_Id.Name"];
      const EOConceptId = `EOConcept_${item["EOConcept_Id.Id"]}`;
      const EOConceptParameterId = `EOConceptParameter_${item.Id}`;
      // const ParameterDefinitionId = `ParameterDefinition_${item["ParameterDefinition_Id"]}`;
      const ParameterDefinitionName = item["ParameterDefinition_Id.Name"];
      const description = item.Description;
      if (!this.project[projectId]) {
        this.project[projectId] = {
          id: `${projectId}`,
          label: projectName.replace(/^APD./, ""),
          description: "",
          children: [],
        };
      }
      // 找到project结构
      const projectChildren = this.project[projectId].children;
      let EOConceptItem = projectChildren.find(
        (item) => item.id === EOConceptId
      );
      if (!EOConceptItem) {
        EOConceptItem = {
          id: EOConceptId,
          label: EOConceptName.replace(/^APD./, ""),
          description: "",
          children: [],
        };
        projectChildren.push(EOConceptItem);
      }
      const EOConceptItemChildren = EOConceptItem.children;
      let EOConceptParameterItem = EOConceptItemChildren.find(
        (item) => item.id === EOConceptParameterId
      );
      if (!EOConceptParameterItem) {
        EOConceptParameterItem = {
          id: EOConceptParameterId,
          label: ParameterDefinitionName,
          description,
          children: [],
        };
        EOConceptItemChildren.push(EOConceptParameterItem);
      }
    });
  }

  public getProject() {
    return Object.keys(this.project).map((key) => this.project[key]);
  }
}
const eoc = new EOConcept(EOConceptParameters as any);
eoc.parseProject2Tree();
console.log(eoc.getProject());

const data = eoc.getProject();
</script>
<style scoped lang="scss"></style>
