<style>
  #debug {
    width: 100%;
    height: 100%;
  }
  /** Top Menu **/
  h3 {
    margin: 0;
    padding: 10px;
    font-size: 20px;
  }
  h3 span {
    margin-right: 10px;
    float: right;
  }
  .fa {
    margin: 0 10px;
    cursor: pointer;
  }
  .fa-play {
    color: #23922b;
  }
  .fa-stop {
    color: #aa0000;
  }
  .not-active {
    color: gray !important;
    pointer-events: none;
    cursor: not-allowed;
  }

  /** Debug Table */
  #variable-table-container {
    overflow: scroll;
    margin-bottom: 10px;
  }

  #variable-table {
    border-collapse: collapse;
    width: 100%;
    font-weight: 600;
  }

  #variable-table td,
  #variable-table th {
    border: 1px solid #ddd;
    padding: 8px;
    background-color: white;
  }

  #variable-table tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  #variable-table tr:hover {
    background-color: #ddd;
  }

  #variable-table th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #505bda;
    color: white;
  }

  .colorValue {
    color: white;
  }

  .coloredElement {
    margin-left: 10px;
    padding: 5px 10px;
  }
  .colorValue:first-of-type .coloredElement {
    margin-left: 0;
  }
</style>

<div id="debug">
  <h3>
    Debug
    <span>
      <i class="fa fa-play not-active" />
      <i class="fa fa-stop not-active" />
    </span>
  </h3>
  <div id="variable-table-container">
    <table id="variable-table">
      <thead>
        <tr>
          <th>Variable Name</th>
          <th>Data Type</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody id="variable-tbody">
        <tr>
          <td>isHot</td>
          <td>String</td>
          <td>true</td>
        </tr>
        <tr>
          <td>Color list</td>
          <td>Color List</td>
          <td>
            <span class="colorValue">
              <span style="background-color: red" class="coloredElement">
                1
              </span>
              <span style="background-color: green" class="coloredElement">
                2
              </span>
              <span style="background-color: blue" class="coloredElement">
                3
              </span>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

</div>
