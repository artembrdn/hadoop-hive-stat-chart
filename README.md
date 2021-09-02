# Hadoop HIVE stat export and viewing as a graph
📝 Uploading statistics of filling in all tables in HIVE to a file and displaying it as a graph in the browser.
***




##### STEPS:
* Execute bash script - [get_stat.sh](/bash/get_stat.sh).

    STAT FILE EXAMPLE
    
    table_name  | date_trunc_to_hour | count
    | --- | ----------- | ------
    test  | 20210902140000  | 124324124214
    test  | 20210902150000  | 154323124214
    test2  | 20210902140000  | 555
    test2  | 20210902150000  | 5554
* After that, you have a file with statistics that you need to upload to the page to display the graph.
    Graph example
  ![Chart example](/img/chart_example.png)