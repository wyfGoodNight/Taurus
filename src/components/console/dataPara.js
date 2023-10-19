export function dataPara(name) {
    let obj={
        nums: 1,
        omegaPara: [],
        wPara: [],
        aPara: [],
        bPara: []
    }
    if (name === "Balanced Stress Model") {
        obj.nums = 2;
        obj.omegaPara=["V2Value","V2Value"];
        obj.wPara=[1,-1];
        obj.aPara=[1,-1];
        obj.bPara=[1,-1];
    }
    else if (name === "Stress Model") {
        obj.nums = 2;
        obj.omegaPara=["V2Value","V2Value"];
        obj.wPara=[1,-1];
        obj.aPara=[1,0];
        obj.bPara=[2,1];
    }
    else if (name === "Maxent") {
        obj.nums = 3;
        obj.omegaPara=["EValue","EValue","V2Value"];
        obj.wPara=[1,-1,-0.01];
        obj.aPara=[1,0,-1];
        obj.bPara=[2,1,0];
    }
    else if (name === "Force-directed Placement") {
        obj.nums = 2;
        obj.omegaPara=["EValue","V2Value"];
        obj.wPara=[1,-1];
        obj.aPara=[2,-1];
        obj.bPara=[0,0];
    }
    else if (name === "LinLog") {
        obj.nums = 2;
        obj.omegaPara=["EValue","V2Value"];
        obj.wPara=[1,-0.1];
        obj.aPara=[0,-1];
        obj.bPara=[0,0];
    }
    return obj;
}