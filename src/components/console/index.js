import React from "react";
import { Upload, Button, Dropdown, InputNumber, Select, Switch, Tooltip } from "antd";
import { UploadOutlined, ForwardOutlined, DownOutlined, WarningOutlined, PaperClipOutlined } from '@ant-design/icons'
import { MathJaxContext, MathJax } from "better-react-mathjax"

import { block_2000 } from "./data/block_2000";
import { block_2000_class } from "./data/block_2000_class";
import { clusterHiera_class } from "./data/clusterHiera_class";

import { clusterHiera } from "./data/clusterHiera";
import { bfwa782 } from "./data/bfwa782";
import { dwt_1005 } from "./data/dwt_1005";
import { visbrazil } from "./data/visbrazil";
import { netscience } from "./data/netscience";
import { ca_CSphd } from "./data/ca-CSphd";
import { qh882 } from "./data/qh882";
import { bcspwr07 } from "./data/bcspwr07";
import { rajat11 } from "./data/rajat11";
import { fpga_dcop_07 } from "./data/fpga_dcop_07";

import { dataPara } from './dataPara';

import "./index.css";
import Graph from "../graph";
import * as d3 from "d3";


const { Option } = Select;
export default class ControlBoard extends React.Component {
    tooltipText = <span>
                    Only the "source target" format is supported currently. For example:
                    <br/>
                    0 1
                    <br/>
                    1 2
                    <br/>
                    2 0
                    <br/>
                    The corresponding graph is a triangle of nodes 0,1 and 2.
                </span>
    defaultData = "rajat11";//默认数据
    defaultFunction = "Balanced Stress Model"//默认模型
    defaulFunctionObject = dataPara(this.defaultFunction);//默认模型的参数
    data = rajat11();//获得数据
    userUpload = false;//是否是用户上传数据
    pmdsBody = "false";//对应pmds
    state = {
        isUpload: false,
        functionObject: this.defaulFunctionObject,
        pmds: false,
        selectedData: this.defaultData,
        selectedModel: this.defaultFunction
    };
    exampleDatas = [
        "block_2000",
        "clusterHiera",
        "bfwa782",
        "dwt_1005",
        "visbrazil",
        "netscience",
        "ca-CSphd",
        "qh882",
        "bcspwr07",
        "rajat11",
        "fpga_dcop_07"
    ];
    exampleModels = [
        "Balanced Stress Model",
        "Stress Model",
        "Maxent",
        "Force-directed Placement",
        "LinLog"
    ];

    
    Datamapping = (data) => data.map((item, index) => ({
        key: index,
        label: <a key={index} onClick={this.clickSelectExampleData(item)}>
            {item}
        </a>
    }))

    Modelmapping = (data) => data.map((item, index) => ({
        key: index,
        label: <a key={index} onClick={this.clickSelectModelKind(item)}>
            {item}
        </a>
    }))

    //选取示例数据
    clickSelectExampleData = (dataKind) => {
        return () => {
            let dataArr = []
            let { selectedData } = this.state;
            selectedData = dataKind;
            if (selectedData === "block_2000")
                dataArr = block_2000();
            if (selectedData === "clusterHiera")
                dataArr = clusterHiera();
            if (selectedData === "bfwa782")
                dataArr = bfwa782();  
            if (selectedData === "dwt_1005")
                dataArr = dwt_1005();  
            if (selectedData === "visbrazil")
                dataArr = visbrazil();  
            if (selectedData === "netscience")
                dataArr = netscience();
            if (selectedData === "ca-CSphd")
                dataArr = ca_CSphd();  
            if (selectedData === "qh882")
                dataArr = qh882();
            if (selectedData === "bcspwr07")
                dataArr = bcspwr07();      
            if (selectedData === "rajat11")
                dataArr = rajat11();    
            if (selectedData === "fpga_dcop_07")
                dataArr = fpga_dcop_07();    
                
        
            this.data = dataArr;
            this.userUpload = false;
            this.setState({ selectedData });
        };
    }

    //选择示例模型
    clickSelectModelKind = (modelKind) => {
        return () => {
            let { selectedModel, functionObject, pmds } = this.state;
            selectedModel = modelKind;
            functionObject = dataPara(modelKind);
            pmds = false;
            if (selectedModel === "Maxent") {
                this.pmdsBody = "true";
                pmds = true;
            }
            this.setState({ selectedModel, functionObject, pmds });
        }
    }

    //更改pmds
    changePmds = (value) => {
        this.pmdsBody = value;
        let { pmds, selectedModel } = this.state;
        pmds = !pmds;
        selectedModel = "";//置空为了显示“function templetes”
        this.setState({ pmds, selectedModel });
    }

    //更改参数
    changePara = (index, kind) => {
        return (value) => {
            let { functionObject, selectedModel } = this.state;
            const { omegaPara, wPara, aPara, bPara } = functionObject;
            if (kind === "omegaPara")
                omegaPara[index] = value;
            if (kind === "wPara")
                wPara[index] = value;
            if (kind === "aPara")
                aPara[index] = value;
            if (kind === "bPara")
                bPara[index] = value;
            selectedModel = "";
            this.setState({ functionObject, selectedModel });
        }
    }

    //点击运行模型
    submitPara = () => {
        let map = {
            "": 0,
            "Balanced Stress Model": 1,
            "Stress Model": 2,
            "Maxent": 3,
            "Force-directed Placement": 4,
            "ForceAtlas2": 6,
            "LinLog": 5,
            "V2Value": 0,
            "EValue": 1,
            "SValue": 2,
            "NPValue": 3,
            "true": 1,
            "false": 0
        };

        let wasPara = "";
        let functionObject = this.state.functionObject;
        let selectedModel = this.state.selectedModel;
        let selectedData = this.state.selectedData;
        wasPara = wasPara + map[selectedModel] + "*";
        wasPara = wasPara + functionObject.nums + ","
        for (let i = 0; i < functionObject.nums; i++)
        {
            if (i !== functionObject.nums - 1) {
                wasPara = wasPara + map[functionObject.omegaPara[i]] + ","
                    + functionObject.wPara[i] + ","
                    + functionObject.aPara[i] + ","
                    + functionObject.bPara[i] + ",";
            } else {
                wasPara = wasPara + map[functionObject.omegaPara[i]] + ","
                    + functionObject.wPara[i] + ","
                    + functionObject.aPara[i] + ","
                    + functionObject.bPara[i];
            }
        }
        wasPara = wasPara + "*" + map[this.pmdsBody];
        wasPara = wasPara + "*" + this.data.length + ",";
        //对得到的数据进行映射
        let pointMap = new Map();
        let reversePointMap = new Map();
        let drawData = {
            nodes: [],
            links: []
        }

        for (let i = 0; i < this.data.length; i++) {
            let line = this.data[i]
            if (!pointMap.has(line[0])) {
                pointMap.set(line[0], pointMap.size);
                reversePointMap.set(reversePointMap.size, line[0]);
            }
            if (!pointMap.has(line[1])) {
                pointMap.set(line[1], pointMap.size);
                reversePointMap.set(reversePointMap.size, line[0]);
            }
            if (i !== this.data.length - 1) {
                wasPara = wasPara + pointMap.get(line[0]) + "," + pointMap.get(line[1]) + ",";
            } else {
                wasPara = wasPara + pointMap.get(line[0]) + "," + pointMap.get(line[1]);
            }
        }
        console.log("aaaaaaa", wasPara);
        let pending = true;
        let self = this;
        Graph.classObj.setState({ pending });

        //一秒后执行下面这部分代码
        setTimeout(() => {
            let location = window.UTF8ToString(window._layout(self.toCharPtr(wasPara))).split(",");
            console.log(self.toCharPtr(wasPara));
            let nodes_class = [];//节点类别
            if (selectedData === "block_2000")
            {
                let theColors = ["rgba(49, 130, 189,1)", "rgba(255, 127, 14,1)", "rgba(44, 160, 44,1)", "rgba(214, 39, 40,1)",
                    "rgba(148, 103, 189,1)", "rgba(140, 86, 75,1)", "rgba(227, 119, 194,1)", "rgba(188, 189, 34,1)",
                    "rgba(23, 190, 207,1)", "rgba(127, 103, 39,1)", "rgba(220, 20, 60,1)", "rgba(250, 128, 114,1)",
                    "rgba(255, 0, 255,1)", "rgba(255, 228, 181,1)", "rgba(255, 215, 0,1)", "rgba(0, 128, 114,1)",
                    "rgba(112, 128, 144,1)", "rgba(30, 144, 255,1)", "rgba(128, 70, 0,1)", "rgba(128, 128, 128,1)",
                ];
                nodes_class = block_2000_class();   
                Graph.classObj.changeColors(theColors);    
            }
            else if (selectedData === "clusterHiera")
            {
                let theColors =["rgba(49, 130, 189,1)", "rgba(107, 174, 214,1)", "rgba(158, 202, 225,1)", "rgba(198, 219, 239,1)",
                        "rgba(230, 85, 13,1)", "rgba(253, 141, 60,1)", "rgba(252, 174, 107,1)", "rgba(253, 208, 162,1)",
                        "rgba(49, 163, 84,1)", "rgba(116, 196, 118,1)", "rgba(161, 217, 155,1)", "rgba(199, 233, 192,1)",
                        "rgba(117, 107, 177,1)", "rgba(158, 154, 200,1)", "rgba(203, 139, 203,1)", "rgba(218, 218, 235,1)",
                        "rgba(112, 128, 144,1)", "rgba(30, 144, 255,1)", "rgba(128, 70, 0,1)", "rgba(128, 128, 128,1)"];
                nodes_class = clusterHiera_class();
                Graph.classObj.changeColors(theColors);    
            }
            else
                nodes_class = Array(pointMap.size).fill(0);
            
            let keysIter = pointMap.keys();
            let thekeys = Array.from(keysIter);
            let NaNflag = false;
            for (let i = 0; i < pointMap.size; i++)
            {
                let x = Number(location[i * 2])
                let y = Number(location[i * 2 + 1]);
                if (isNaN(x) || isNaN(y))
                    NaNflag = true;
                x++;
                y++;
                drawData["nodes"][i] = {
                    id: i,
                    "x": x,
                    "y": y,
                    "class": nodes_class[thekeys[i]]
                }
            }

            for (let i = 0; i < self.data.length; i++)
            {
                let line = self.data[i]
                drawData["links"][i] = {
                    "source": pointMap.get(line[0]),
                    "target": pointMap.get(line[1])
                }
            }
            if (NaNflag) {
                alert("The given parameter is not reasonable");
                let drawData = {
                    nodes: [],
                    links: []
                };
                Graph.classObj.replace(drawData);
            }
            else
                Graph.classObj.replace(drawData);
        }, 10)
    }

    D3js = () => {
        let pointMap = new Map();
        let reversePointMap = new Map();
        let drawData = {
            nodes: [],
            links: []
        }
        for (let i = 0; i < this.data.length; i++) {
            let line = this.data[i]
            if (!pointMap.has(line[0])) {
                pointMap.set(line[0], pointMap.size);
                reversePointMap.set(reversePointMap.size, line[0]);
            }
            if (!pointMap.has(line[1])) {
                pointMap.set(line[1], pointMap.size);
                reversePointMap.set(reversePointMap.size, line[0]);
            }
        }
        let pending = true;
        let self = this;
        let nodes = [];
        let links = [];

        Graph.classObj.setState({ pending });
        for (let i = 0; i < pointMap.size; i++)
            nodes.push({ id: i });

        for (let i = 0; i < self.data.length; i++) {
            let line = self.data[i];
            links[i] = {
                "source": pointMap.get(line[0]),
                "target": pointMap.get(line[1])
            };
        }

        let selectedData = this.state.selectedData;
        let nodes_class = [];//节点类别
        if (selectedData === "block_2000")
        {
            let theColors = ["rgba(49, 130, 189,1)", "rgba(255, 127, 14,1)", "rgba(44, 160, 44,1)", "rgba(214, 39, 40,1)",
                "rgba(148, 103, 189,1)", "rgba(140, 86, 75,1)", "rgba(227, 119, 194,1)", "rgba(188, 189, 34,1)",
                "rgba(23, 190, 207,1)", "rgba(127, 103, 39,1)", "rgba(220, 20, 60,1)", "rgba(250, 128, 114,1)",
                "rgba(255, 0, 255,1)", "rgba(255, 228, 181,1)", "rgba(255, 215, 0,1)", "rgba(0, 128, 114,1)",
                "rgba(112, 128, 144,1)", "rgba(30, 144, 255,1)", "rgba(128, 70, 0,1)", "rgba(128, 128, 128,1)",
            ];
            nodes_class = block_2000_class();   
            Graph.classObj.changeColors(theColors);    
        }
        else if (selectedData === "clusterHiera")
        {
            let theColors =["rgba(49, 130, 189,1)", "rgba(107, 174, 214,1)", "rgba(158, 202, 225,1)", "rgba(198, 219, 239,1)",
                    "rgba(230, 85, 13,1)", "rgba(253, 141, 60,1)", "rgba(252, 174, 107,1)", "rgba(253, 208, 162,1)",
                    "rgba(49, 163, 84,1)", "rgba(116, 196, 118,1)", "rgba(161, 217, 155,1)", "rgba(199, 233, 192,1)",
                    "rgba(117, 107, 177,1)", "rgba(158, 154, 200,1)", "rgba(203, 139, 203,1)", "rgba(218, 218, 235,1)",
                    "rgba(112, 128, 144,1)", "rgba(30, 144, 255,1)", "rgba(128, 70, 0,1)", "rgba(128, 128, 128,1)"];
            nodes_class = clusterHiera_class();
            Graph.classObj.changeColors(theColors);    
        }
        else
            nodes_class = Array(pointMap.size).fill(0);

        let simulation = d3.forceSimulation()
            .nodes(nodes)
            .force("link", d3.forceLink(links).id(function (d) { return d.id; }))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter());


        let keysIter = pointMap.keys();
        let thekeys = Array.from(keysIter);


        simulation.on("end", () => {
            drawData["nodes"] = nodes.map(function (d) {
                return {
                    id: d.id,
                    "x": d.x,
                    "y": d.y,
                    "class": nodes_class[thekeys[d.id]]
                }
            })

            drawData["links"] = links.map(function (d) {
                return {
                    "source": d.source.id,
                    "target": d.target.id
                }
            })
            Graph.classObj.replace(drawData);   
        });
    };


    toCharPtr = (str) => {
        const ptr = window.allocate(window.intArrayFromString(str), window.ALLOC_NORMAL);
        return ptr;
    }
    
    beforeSynUpload = (file) => {
        let reader = new FileReader();
        reader.readAsText(file)
        let readData = []
        let readMap = new Map();
        let self = this;
        reader.onload = function () {
            let sarr = reader.result.split("\r\n");
            if (sarr.length === 1) {
                sarr = sarr[0].split("\n");
            }
            //读取数据进行映射
            for (let i = 0; i < sarr.length; i++) {
                let lineArr = sarr[i].split(" ");
                let from = lineArr[0];
                let to = lineArr[1];
                if (from === "" || from === undefined || to === "" || to === undefined)
                    continue;
                if (!readMap.has(from)) {
                    readMap.set(from, readMap.size);
                }
                if (!readMap.has(to)) {
                    readMap.set(to, readMap.size);
                }
                readData[readData.length] = [readMap.get(from), readMap.get(to)];
            }
            let selectedData = "";
            self.data = readData;
            self.userUpload = true;
            self.setState({ selectedData });
        }
    }

    render() {
        const { selectedData, selectedModel, pmds } = this.state;
        const { functionObject } = this.state;
        const { nums, wPara, aPara, bPara, omegaPara } = functionObject;
        let alphaFunction = [];
        for (let i = 0; i < nums; i++) {
            if (i === 0) {
                if (wPara.length >= 1 || aPara.length >= 1 || bPara.length >= 1) {
                    let wValue = wPara[i] === undefined ? `\\omega_${i}` : wPara[i];
                    let aValue = aPara[i] === undefined ? `\\alpha_${i}` : aPara[i];
                    let bValue = bPara[i] === undefined ? ` \\beta_${i}` : " " + bPara[i];
                    alphaFunction.push(`F=\\sum_{(i,j)\\in\\Omega}{(${wValue}\\ast{\\parallel x_i-x_j\\parallel}^{${aValue}}/d_{ij}^{\\${bValue}})}`)
                } else {
                    alphaFunction.push(`F=\\sum_{(i,j)\\in\\Omega_${i}}{(\\omega_${i}\\ast{\\parallel x_i-x_j\\parallel}^{\\alpha_${i}}/d_{ij}^{\\beta_${i}})}`)
                }
            }
            if (i !== 0) {
                if (wPara.length >= 1 || aPara.length >= 1 || bPara.length >= 1) {
                    let wValue = wPara[i] === undefined ? `\\omega_${i}` : wPara[i];
                    let aValue = aPara[i] === undefined ? `\\alpha_${i}` : aPara[i];
                    let bValue = bPara[i] === undefined ? ` \\beta_${i}` : " " + bPara[i];
                    alphaFunction.push(`+\\sum_{(i,j)\\in\\Omega_${i}}{(${wValue}\\ast{\\parallel x_i-x_j\\parallel}^{${aValue}}/d_{ij}^{\\${bValue}})}`)
                } else {
                    alphaFunction.push(`+\\sum_{(i,j)\\in\\Omega_${i}}{(\\omega_${i}\\ast{\\parallel x_i-x_j\\parallel}^{\\alpha_${i}}/d_{ij}^{\\beta_${i}})}`)
                }
            }
        }
        return (
            <div className="controlPanel">
                <div className="sourceData" >
                    {/**Example Data */}
                    <div>
                        <Dropdown className="exampleData" menu={{ items: this.Datamapping(this.exampleDatas) } } placement="bottom">
                            <Button>
                                {selectedData === "" ? "Example Data" : selectedData}
                                <DownOutlined />
                            </Button>
                        </Dropdown>
                    </div>
                    {/** Upload Data */}
                    <div>
                        
                            <Upload beforeUpload={this.beforeSynUpload} >
                                <Button className={"uploadData"} icon={
                                <span>
                                    <Tooltip placement="bottom" title={this.tooltipText} color="#f50">
                                        <WarningOutlined style={{color:"#f50"}} />
                                    </Tooltip>
                                    &emsp;
                                    <UploadOutlined />
                                </span>
                            }>Select Files</Button>
                            </Upload>
                    </div>
                </div>

                <div className="function">
                    <div className="functionTem">
                        <Dropdown className="exampleData" menu={{ items: this.Modelmapping(this.exampleModels) }} placement="bottom" >
                            <Button>
                                {selectedModel === "" ? "Function Templetes" : selectedModel}
                                <DownOutlined />
                            </Button>
                        </Dropdown>
                    </div>

                    <MathJaxContext >
                        {
                            alphaFunction.map((item, id) => {
                                if (id === alphaFunction.length - 1)
                                {
                                    return <div key={id} className={id === 0 ? "headAlpha" : "finalAlpha"}>
                                        <MathJax
                                            renderMode={"pre"}
                                            typesettingOptions={{ fn: "tex2chtml" }}
                                            text={item}
                                            inline
                                            dynamic
                                        />
                                    </div>
                                }

                                return <div key={id} className={id === 0 ? "headAlpha" : "finalAlpha"}>
                                    <MathJax
                                        renderMode={"pre"}
                                        typesettingOptions={{ fn: "tex2chtml" }}
                                        text={item}
                                        inline
                                        dynamic
                                    />
                                </div>
                            })
                        }
                    </MathJaxContext>

                    <div className="settingPara">
                    <div className="pmds">
                        PivotMDS init: <Switch checkedChildren="true" unCheckedChildren="false" checked={selectedModel  === "Maxent" ? true : pmds} onChange={this.changePmds} disabled={this.disabled} />
                    </div>
                    {
                        alphaFunction.map((item, index) => {
                            return (
                                <div className="aAlphaLine" key={selectedModel + index}>
                                    <div className="linePara">
                                        <div className="linePara">
                                            <div className="paraName">
                                                <MathJaxContext >
                                                    <MathJax>{`\\[\\Omega_${index}:\\]`}</MathJax>
                                                </MathJaxContext>
                                            </div>
                                            <Select defaultValue={omegaPara[index] === undefined ? "" : omegaPara[index]} style={{ width: 80, marginLeft: "5px" }} onChange={this.changePara(index, "omegaPara")} disabled={this.disabled}>
                                                <Option value="V2Value">V<sup>2</sup></Option>
                                                <Option value="EValue">E</Option>
                                                <Option value="SValue">S</Option>
                                                <Option value="NPValue">N*P</Option>
                                            </Select>
                                        </div>
                                        <div className="linePara">
                                            <div className="paraName">
                                                <MathJaxContext >
                                                    <MathJax>{`\\[\\omega_{${index}}:\\]`}</MathJax>
                                                </MathJaxContext>
                                            </div>
                                            <InputNumber min={-10} defaultValue={wPara[index] === undefined ? "" : wPara[index]} step={0.01} style={{ width: "80px", marginLeft: "5px" }} onChange={this.changePara(index, "wPara")} disabled={this.disabled} />
                                        </div>
                                    </div>
                                    <div className="linePara">
                                        <div className="linePara">
                                            <div className="paraName">
                                                <MathJaxContext >
                                                    <MathJax>{`\\[\\alpha_${index}:\\]`}</MathJax>
                                                </MathJaxContext>
                                            </div>
                                            <InputNumber min={-10} defaultValue={aPara[index] === undefined ? "" : aPara[index]} step={0.01} style={{ width: "80px", marginLeft: "5px" }} onChange={this.changePara(index, "aPara")} disabled={this.disabled} />
                                        </div>
                                        <div className="linePara">
                                            <div className="paraName">
                                                <MathJaxContext >
                                                    <MathJax>{`\\[\\beta_${index}:\\]`}</MathJax>
                                                </MathJaxContext>
                                            </div>
                                            <InputNumber min={-10} defaultValue={bPara[index] === undefined ? "" : bPara[index]} step={0.01} style={{ width: "80px", marginLeft: "5px" }} onChange={this.changePara(index, "bPara")} disabled={this.disabled} />
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

                    <Button type="primary" style={{ marginTop: "10px", width: "150px" }} onClick={this.submitPara} icon={<ForwardOutlined />}>Use This Model</Button>
                </div>
                
                <div className="compare">
                <Button type="primary" style={{ marginTop: "10px", width: "150px" }} onClick={this.D3js} icon={<ForwardOutlined />}>Use D3js.FDP</Button>
                    <br/>
                    <Button type="primary" onClick={() => window.open('https://wyfgoodnight.github.io/t-fdp/', '_blank')} style={{ marginTop: "10px", width: "150px" }} icon={<PaperClipOutlined />}>Open t-FDP</Button>
                </div>
            </div>
        )
    }
}