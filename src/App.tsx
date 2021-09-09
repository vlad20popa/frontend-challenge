import React, {useEffect, useState} from 'react';
import ReactDataGrid from 'react-data-grid';
import './App.scss';
import {intentsFromServer} from "./mock-data/data";
import Dialog from "@material-ui/core/Dialog/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import {Intent} from "./model/Intent";
import { Box } from '@material-ui/core';
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";


function App() {

  const ROW_COUNT = 9;
  const [selectedIndexes, setSelectedIndexes] = useState<Array<number>>([]);
  const [viewItem, setViewItem] = useState<Intent>();
  const [isModalOpened, openModal] = useState<boolean>(false);

  const rows = intentsFromServer.map((intent) => {
    return {
      id: intent.id,
      name: intent.name,
      exprNo: intent.trainingData.expressionCount,
      expression: intent.trainingData.expressions[0].text
    }
  })


  const columns = [
    {
      key: "name",
      name: "Question",
      width: 300
    },
    {
      key: "exprNo",
      name: "No. of possible responses",
      width: 230
    },
    {
      key: "expression",
      name: "Possible response",
      width: 200
    },
    {
      key: "details",
      name: " ",
      width: 300
    }
  ];

  const viewAction = (row: any) => {

    return [
      {
        icon: <span className="view-link">View all responses</span>,
        callback: () => {
          let selectedItem = intentsFromServer.find((item) => item.id === row.id );
          openModal(true);
          setViewItem(selectedItem);
        }
      }
    ];
  }

  const onRowsSelected = (rows: any) => {
    setSelectedIndexes(selectedIndexes.concat(
      rows.map((r: any) => r.rowIdx)
    ))
  };

  const onRowsDeselected = (rows: any) => {
    let rowIndexes = rows.map((r: any) => r.rowIdx);
    setSelectedIndexes(selectedIndexes.filter(
      i => rowIndexes.indexOf(i) === -1
    ))
  };


  const getCellActions = (column: any, row:any) => {
    const cellActions:any = {
      details: viewAction(row)
    };
    return cellActions[column.key];
  }

  const renderResponses = (item: Intent) => {
    return item.trainingData.expressions.map((expresion) => {
      return (<Box component="span" display="block" p={1} m={1} bgcolor="grey">{expresion.text}</Box>);
    })
  }

  const closeModal = () =>{
    openModal(false);
  }


  return (
    <div className="app">
      <header className="app-header">
        <span>Select pretrained expression</span>
      </header>
      <div className="intent-grid">
        <span>
          {selectedIndexes.length} rows selected
        </span>
        <ReactDataGrid
          rowKey="id"
          columns={columns}
          rowGetter={(i:any) => rows[i]}
          rowsCount={ROW_COUNT}
          minHeight={700}
          getCellActions={getCellActions}
          rowSelection={{
            showCheckbox: true,
            enableShiftSelect: true,
            onRowsSelected: onRowsSelected,
            onRowsDeselected: onRowsDeselected,
            selectBy: {
              indexes: selectedIndexes
            }
          }}
        />
      </div>
      <Dialog open={isModalOpened}
      className="modal">
        <MuiDialogTitle id="alert-dialog-title">
          <span>All responses</span>
          <IconButton
            aria-label="close"
            className="close-button"
            onClick={closeModal}
          >
            <CloseIcon />
          </IconButton>
        </MuiDialogTitle>
        <DialogContent>
          <div>
            {viewItem && renderResponses(viewItem)}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
