FROM python:3.12-slim-bookworm AS base

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl ca-certificates fontconfig xz-utils \
    fonts-linuxlibertine fonts-inter fonts-noto-core fonts-noto-cjk fonts-noto-color-emoji \
    && rm -rf /var/lib/apt/lists/*

ENV TYPST_BIN_DIR=/opt/typst
RUN mkdir -p ${TYPST_BIN_DIR} && \
    for ver in 0.13.1 0.12.0 0.11.1; do \
      curl -fsSL "https://github.com/typst/typst/releases/download/v${ver}/typst-x86_64-unknown-linux-musl.tar.xz" \
        | tar -xJ --strip-components=1 -C ${TYPST_BIN_DIR} "typst-x86_64-unknown-linux-musl/typst" && \
      mv ${TYPST_BIN_DIR}/typst ${TYPST_BIN_DIR}/typst-${ver}; \
    done && \
    ln -s ${TYPST_BIN_DIR}/typst-0.13.1 ${TYPST_BIN_DIR}/typst

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY typstbox_worker ./typstbox_worker

ENV DATA_DIR=/data
ENV PATH="${TYPST_BIN_DIR}:${PATH}"
EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

CMD ["uvicorn", "typstbox_worker.main:app", "--host", "0.0.0.0", "--port", "8080"]
