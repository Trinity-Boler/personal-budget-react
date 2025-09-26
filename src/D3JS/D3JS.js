import React, { useEffect } from "react";
import * as d3 from "d3";

function D3JS() {
  useEffect(() => {
    const width = 960,
      height = 450,
      radius = Math.min(width, height) / 2;
      d3.select("#budgetChart").selectAll("*").remove();

    const pie = d3.pie().sort(null).value((d) => d.budget);
    const arc = d3.arc().outerRadius(radius * 0.8).innerRadius(radius * 0.4);
    const outerArc = d3.arc().innerRadius(radius * 0.9).outerRadius(radius * 0.9);

    const svg = d3
      .select("#budgetChart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    svg.append("g").attr("class", "slices");
    svg.append("g").attr("class", "labels");
    svg.append("g").attr("class", "lines");

    const color = d3
      .scaleOrdinal()
      .range([
        "#ffcd56",
        "#ff6384",
        "#36a2eb",
        "#fd6b19",
        "#cc65fe",
        "#2ecc71",
        "#e74c3c",
      ]);

    const key = (d) => d.data.title;


    d3.json("http://localhost:3001/budget").then((data) => {
      change(data.myBudget);
    });

    function change(data) {
      /* PIE SLICES */
      const slice = svg.select(".slices").selectAll("path.slice").data(pie(data), key);

      slice
        .enter()
        .append("path")
        .attr("class", "slice")
        .style("fill", (d) => color(d.data.title))
        .merge(slice)
        .transition()
        .duration(1000)
        .attrTween("d", function (d) {
          this._current = this._current || d;
          const interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return (t) => arc(interpolate(t));
        });

      slice.exit().remove();

      /* TEXT LABELS */
      const text = svg.select(".labels").selectAll("text").data(pie(data), key);

      text
        .enter()
        .append("text")
        .attr("dy", ".35em")
        .text((d) => d.data.title)
        .merge(text)
        .transition()
        .duration(1000)
        .attrTween("transform", function (d) {
          this._current = this._current || d;
          const interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return (t) => {
            const d2 = interpolate(t);
            const pos = outerArc.centroid(d2);
            pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
            return `translate(${pos})`;
          };
        })
        .styleTween("text-anchor", function (d) {
          this._current = this._current || d;
          const interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return (t) => {
            const d2 = interpolate(t);
            return midAngle(d2) < Math.PI ? "start" : "end";
          };
        });

      text.exit().remove();

      /* POLYLINES */
      const polyline = svg.select(".lines").selectAll("polyline").data(pie(data), key);

      polyline
        .enter()
        
        .append("polyline")
        .merge(polyline)
        .transition()
        .duration(1000)
        .style("stroke", "black")
        .style("stroke-width", 1)
        .style("fill", "none")
        .attrTween("points", function (d) {
          this._current = this._current || d;
          const interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return (t) => {
            const d2 = interpolate(t);
            const pos = outerArc.centroid(d2);
            pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
            return [arc.centroid(d2), outerArc.centroid(d2), pos];
          };
        });

      polyline.exit().remove();
    }

    function midAngle(d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }
  }, []);

  return <div id="budgetChart"></div>;
}

export default D3JS;
