package main

import (
	"fmt"
	"github.com/gorilla/sessions"
	"github.com/labstack/echo"
	"github.com/shurcooL/github_flavored_markdown"
	"log"
	"net/http"
	"os"
	"outlineeditor/client"
	"outlineeditor/static"
)

var store = sessions.NewCookieStore([]byte("something-very-secret"))

type Text struct {
	Text string `json:"text" form:"text" query:"text"`
}

func asset(name string) string {
	bs, recoverAssetError := static.Asset("assets/" + name)
	if recoverAssetError != nil {
		log.Fatal(recoverAssetError)
	}
	return string(bs)
}

func name(c echo.Context) string {
	params := c.QueryParams()
	return params.Get("name")
}

func main() {
	fmt.Println("Drivers! Start Your ENGINE!!!")

	e := echo.New()
	e.GET("/api/raw", func(c echo.Context) error {

		return c.String(http.StatusOK, client.Get(name(c)))
	})

	e.GET("/api/markdown", func(c echo.Context) error {
		markdown := string(github_flavored_markdown.Markdown([]byte(client.Get(name(c)))))
		return c.String(http.StatusOK, markdown)
	})

	e.POST("/api", func(c echo.Context) error {
		var t Text
		err := c.Bind(&t)
		if err != nil {
			e.Logger.Fatal(err)
			return c.String(http.StatusOK, "NG")
		}
		client.Post(name(c), t.Text)
		return c.String(http.StatusOK, "OK")
	})

	e.GET("/login", func(c echo.Context) error {
		return c.HTML(http.StatusOK, asset("login.html"))
	})
	e.POST("/login", func(c echo.Context) error {
		params, _ := c.FormParams()
		if string(params.Get("password")) == os.Getenv("PASSWORD") {
			session, _ := store.Get(c.Request(), "login-sessin")
			session.Values["logined"] = "yes"
			session.Save(c.Request(), c.Response())
			fmt.Println("Sign In")
		}
		return c.Redirect(302, "/")
	})

	e.GET("/bundle.js", func(c echo.Context) error {
		return c.String(http.StatusOK, asset("bundle.js"))
	})

	e.GET("/gfm.css", func(c echo.Context) error {
		return c.String(http.StatusOK, asset("gfm.css"))
	})

	e.GET("/*", func(c echo.Context) error {
		session, _ := store.Get(c.Request(), "login-sessin")
		if session.Values["logined"] == nil {
			return c.Redirect(302, "/login")
		}
		return c.HTML(http.StatusOK, asset("index.html"))
	})

	e.Logger.Debug(e.Start("0.0.0.0:" + os.Getenv("PORT")))
}
