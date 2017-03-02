FROM frolvlad/alpine-glibc
RUN mkdir /app
COPY outlineeditor /app/outlineeditor
CMD ["/app/outlineeditor"]
