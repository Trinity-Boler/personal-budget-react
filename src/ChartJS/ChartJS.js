import React, { useEffect, useRef } from "react";
import axios from "axios";
import { Chart  } from "chart.js/auto"; 

function ChartJS() {
  const myChart  = useRef(null);   
  const chartInstance = useRef(null); 

  useEffect(() => {
    axios.get("http://localhost:3001/budget") 
      .then((res) => {
        const labels = res.data.myBudget.map(item => item.title);
        const data = res.data.myBudget.map(item => item.budget);

    
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        chartInstance.current = new Chart(myChart.current, {
          type: "doughnut",
          data: {
            labels: labels,
            datasets: [
              {
                data: data,
                backgroundColor: [
                  '#ffcd56',
                            '#ff6384',
                            '#36a2eb',
                            '#fd6b19',
                            '#cc65fe',
                            '#2ecc71',
                            '#e74c3c',
                ],
              },
            ],
          },
        });
      });
  }, []); // runs once when component mounts

  return <canvas ref={myChart } width="400" height="400"></canvas>;
}

export default ChartJS;
