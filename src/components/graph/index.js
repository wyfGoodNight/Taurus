import React from "react";
import * as d3 from "d3";
import { Spin, Space } from "antd";

export default class Graph extends React.Component {
    static classObj;
    colors = [
        "rgba(31, 119, 180,1)",
        "rgba(255, 127, 14,1)",
        "rgba(44, 160, 44,1)",
        "rgba(214, 39, 40,1)",
        "rgba(148, 103, 189,1)",
        "rgba(140, 86, 75,1)",
        "rgba(227, 119, 194,1)",
        "rgba(188, 189, 34,1)",
        "rgba(23, 190, 207,1)",
        "rgba(127, 103, 39,1)",
        "rgba(220, 20, 60,1)",
        "rgba(250, 128, 114,1)",
        "rgba(255, 0, 255,1)",
        "rgba(255, 228, 181,1)",
        "rgba(255, 215, 0,1)",
        "rgba(0, 128, 114,1)",
        "rgba(112, 128, 144,1)",
        "rgba(30, 144, 255,1)",
        "rgba(128, 70, 0,1)",
        "rgba(128, 128, 128,1)",
    ];
    state = {
        data: {
            nodes: [],
            links: []
        },
        pending: false,//是否在等待绘图完成（出现等待的符号）
    };
    
    //构造函数
    constructor(){
        super();
        Graph.classObj= this;
    }
    
    //外面部件调用classObj.replace更新绘图数据
    replace = (mydata) => {
        let data = mydata;
        let pending = false;//不需要等待加载符号了，直接画结果
        // console.log(mydata)
        this.setState({ data, pending });//更新数据
    }

    changeColors(colorsData) {
        this.colors = colorsData;
    }

    //更新后绘图数据后进行绘制
    componentDidUpdate() {
        let { data, pending } = this.state;
        if (pending) {//点击run this model后在绘图前会调用一次setState来更新一下pending值，将其置为true后以呈现等待加载的符号
            data = {
                nodes: [],
                links: []
            }
        }
        else {
            this.drawGraph(data);//作图
        }
    }

    //用d3根据坐标进行绘图
    drawGraph = (mesh) => {
        d3.select(".mySvg").remove();
        let nodes = mesh.nodes;
        let links = mesh.links;
        // console.log(nodes);
        let allWidth = window.getComputedStyle(d3.select(".graphDraw").node()).width;
        allWidth = Number(allWidth.replace("px",""));
        let allHeight = window.getComputedStyle(d3.select(".graphDraw").node()).height;
        allHeight = Number(allHeight.replace("px",""));
        let margin = { top: 30, right: 30, bottom: 30, left: 30 };
        let minScreen = allWidth > allHeight ? allHeight : allWidth;
        minScreen = minScreen < 5 ? 5 : minScreen;;
        let layoutHeight = minScreen * 4 / 5;
        margin.right = (allWidth - layoutHeight) / 2;
        margin.left = (allWidth - layoutHeight) / 2;
        margin.top = (allHeight - layoutHeight) / 2;
        margin.bottom = (allHeight - layoutHeight) / 2;
        
        let width = layoutHeight;
        let height = layoutHeight;
        let map = {};
        let max = -Infinity, xmax = -Infinity;
        let min = Infinity, xmin = Infinity;
        nodes.forEach(e => {
            if (e.y > max)
                max = e.y;
            if (e.y < min)
                min = e.y;
            if (e.x > xmax)
                xmax = e.x;
            if (e.x < xmin)
                xmin = e.x;
        });
        nodes.forEach(e => {
            e.x = (e.x - xmin) / (xmax - xmin + 0.0000001) * width;
            e.y = (e.y - min) / (max - min + 0.000001) * height;
            map[e.id] = { x: e.x, y: e.y };
        })
        const svg = d3.select(".graphDraw")
            .append("svg")
            .attr("class", "mySvg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
        
        svg.selectAll("line")
            .data(links)
            .enter()
            .append("line")
            .attr("x1", d => map[d.source].x)
            .attr("y1", d => map[d.source].y)
            .attr("x2", d => map[d.target].x)
            .attr("y2", d => map[d.target].y)
            .attr("stroke", "rgb(204,204,204")
            .attr("stroke-width", 1)
            .attr("stroke-opacity", 1);
            // .style("stroke", "rgba(150,150,150,1)");
        
        let radius = 3.0;
        let n = nodes.length;
        if (n >= 200) radius = 2.5;
        if (n >= 500) radius = 2.0;
        if (n >= 1000) radius = 1.5;
        if (n >= 2000) radius = 1;
        if (n >= 8000) radius = 0.8;

        svg.selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("r", radius)
            .style("fill",d => this.colors[d.class])
            // .style("fill", "white")
            .style("stroke", d => this.colors[d.class])
            .style("stroke-width", 2)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    }

    //更改窗口大小重新绘制
    resizeGraph = () => {
        let { data } = this.state;
        this.drawGraph(data);
    }

    //挂载时增加监听窗口大小改变事件
    componentDidMount() {
        this.drawGraph({ nodes: [], links: [] });
        window.addEventListener("resize", this.resizeGraph);
    }

    //去除组件时一并取消监听器
    componentWillUnmount(){
        window.removeEventListener("resize", this.resizeGraph);
    }

    //进行渲染
    render(){
        d3.select(".mySvg").remove();//去掉先前绘制的图片
        let { pending } = this.state;
        return (
            <>
                <div className="graphDraw" style={{
                    background:"rgb(255,255,255)",
                    width:'calc(100vw - 650px)',
                    height:'calc(100vh - 66px)',
                    marginLeft:50,
                    marginTop:0
                }}>
                    {/* <Space size={"large"} style={{display:!pending?'none':'flex',width:'100%',height:'100%',marginLeft:0,arginTop:0,alignItems: "center", justifyContent: "center", transform: "scale(3)"}}>
                        <Spin size="large"/>
                    </Space>  */}
                    <Space size={"large"} style={{
                        display:!pending?'none':'inline-flex',
                        alignItems: "center",
                        justifyContent: "center",
                        transform: "translate(0px,calc(50vh - 33px)) scale(3)"
                    }}>
                        <Spin size="large"/>
                    </Space>
                </div>
            </>
        )
    }
    //1vw = 1/100视口宽度 1vh = 1/100视口高度
}