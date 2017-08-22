/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Npm packages imports
import moment from 'moment';
import Chart from 'chart.js';

Template.uniqueUsersOverTime.onRendered(function () {
  const instance = this;

  // Get ElasticSearch aggregated data
  const elasticsearchData = Template.currentData().buckets;

  // Get Labels for chart
  const labels = elasticsearchData.map(value => {
    return moment(value.key).format('MM/DD');
  });

  // Get x & y points for chart
  const data = elasticsearchData.map(value => {
    return {
      x: value.key,
      y: value.unique_users.buckets.length,
    };
  });

  // Get querySelector to related <canvas>
  const querySelector = `[data-overview-id="${instance.data.id}"] .unique-users-time-chart`;

  // Realize chart
  const ctx = document.querySelector(querySelector).getContext('2d');
  instance.chart = new Chart(ctx, {
    // The type of chart we want
    type: 'line',

    // Data for displaying chart
    data: {
      labels,
      datasets: [
        {
          label: 'Users',
          backgroundColor: '#959595',
          borderColor: '#959595',
          pointBorderColor: '#959595',
          data,
          fill: false,
        },
      ],
    },

    // Configuration options
    options: {
      legend: {
        display: false,
      },
      layout: {
        padding: {
          left: 10,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
          },
        }],
      },
    },
  });
});