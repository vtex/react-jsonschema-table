import React from 'react'
import { Column, Table, AutoSizer } from 'react-virtualized'
import 'react-virtualized/styles.css'

export default function ReadOnlyTable({ items, schema, UIschema }) {
    return (
      <AutoSizer>
        {({ width, height }) => (
          <Table
            width={width}
            height={height}
            headerHeight={20}
            rowHeight={30}
            rowCount={items.length}
            rowGetter={({ index }) => items[index].document}
          >
            <Column
              className="ml4"
              headerRenderer={() => {
                return (
                  <React.Fragment>
                    <div className="ReactVirtualized__Table__headerTruncatedText">
                      Index
                    </div>
                  </React.Fragment>
                )
              }}
              dataKey="index"
              label="Index"
              width={200}
            />
            {
              Object.keys(schema.properties).map((key, index) => {
                const label = schema.properties[key].title
                const width = UIschema.fields[key].width
                return (
                  <Column
                    key={index}
                    headerRenderer={() => {
                      return (
                        <React.Fragment>
                          <div className="ReactVirtualized__Table__headerTruncatedText">
                            {label}
                          </div>
                        </React.Fragment>
                      )
                    }}
                    dataKey={key}
                    label={label}
                    width={width}
                  />
                )
              })
            }
          </Table>
        )}
      </AutoSizer>
    )
}
