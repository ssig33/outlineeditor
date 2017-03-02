package client

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"os"
)

func main() {
	fmt.Println("vim-go")
}

type MyDB struct {
	Error string   `json:"error"`
	Value string   `json:"value"`
	Key   string   `json:"key"`
	Tags  []string `json:"tags"`
}

func checkError(err error) {
	if err != nil {
		panic(err.Error())
	}
}

func Get(name string) string {
	db, err := sql.Open("mysql", os.Getenv("DATABASE_URL"))
	checkError(err)
	defer db.Close()

	rows, err := db.Query("SELECT * from pages where name = ?", name)
	defer rows.Close()
	checkError(err)

	var result string
	for rows.Next() {
		var name, value string
		err := rows.Scan(&name, &value)
		checkError(err)
		result = value
	}

	return result
}

func checkCount(rows *sql.Rows) (count int) {
	for rows.Next() {
		err := rows.Scan(&count)
		checkError(err)
	}
	return count
}

func Post(name, text string) {
	db, err := sql.Open("mysql", os.Getenv("DATABASE_URL"))
	checkError(err)
	defer db.Close()

	rows, err := db.Query("SELECT COUNT(*) as count FROM pages where name = ?", name)
	if checkCount(rows) == 0 {
		query := "INSERT INTO pages (name, value) VALUES (?, ?)"
		_, err := db.Exec(query, name, text)
		checkError(err)
		fmt.Println("INSERTED")
	} else {
		query := "UPDATE pages SET value=? WHERE name=?"
		_, err := db.Exec(query, text, name)
		checkError(err)
		fmt.Println("UPDATED")
	}
}
