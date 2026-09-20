@echo off

setlocal enabledelayedexpansion

color 0A

title Divisor de Compras - Inicializador

set "NODE_REQUIRED=20.20.1"
set "PROJECT_ROOT=%~dp0.."

cd /d "%PROJECT_ROOT%"

echo ==========================================
echo     INICIANDO DIVISOR DE COMPRAS
echo ==========================================
echo.

REM =====================================================
REM Verificar Node
REM =====================================================

echo [1/3] Verificando Node...

set "NODE_CURRENT="

for /f "delims=v" %%i in ('node -v 2^>nul') do (
    set "NODE_CURRENT=%%i"
)

if not defined NODE_CURRENT (
    echo.
    echo [ERRO] Node.js nao encontrado.
    echo Instale o Node.js ou o NVM antes de continuar.
    echo.
    pause
    exit /b 1
)

echo  Atual: %NODE_CURRENT%
echo  Necessario: %NODE_REQUIRED%

if /I "%NODE_CURRENT%"=="%NODE_REQUIRED%" (
    echo  [OK] Node correto.
) else (
    echo.
    echo  Node %NODE_REQUIRED% necessario.

    where nvm >nul 2>nul

    if errorlevel 1 (
        echo.
        echo [ERRO] NVM nao encontrado.
        echo Instale o NVM para poder alterar automaticamente a versao do Node.
        echo.
        pause
        exit /b 1
    )

    echo  Verificando instalacao do Node %NODE_REQUIRED%...

    nvm list | find "%NODE_REQUIRED%" >nul

    if errorlevel 1 (
        echo  Instalando Node %NODE_REQUIRED%...

        call nvm install %NODE_REQUIRED%

        if errorlevel 1 (
            echo.
            echo [ERRO] Falha ao instalar Node %NODE_REQUIRED%.
            echo.
            pause
            exit /b 1
        )
    )

    echo  Alterando versao do Node...

    call nvm use %NODE_REQUIRED%

    if errorlevel 1 (
        echo.
        echo [ERRO] Falha ao trocar para o Node %NODE_REQUIRED%.
        echo.
        pause
        exit /b 1
    )

    echo  [OK] Node alterado.
)

echo.

REM =====================================================
REM Verificar dependencias
REM =====================================================

echo [2/3] Verificando dependencias...

if not exist "%PROJECT_ROOT%\node_modules" (
    echo  node_modules nao encontrado.
    echo  Instalando dependencias...

    cd /d "%PROJECT_ROOT%"

    call npm install

    if errorlevel 1 (
        echo.
        echo [ERRO] Falha ao instalar as dependencias.
        echo.
        pause
        exit /b 1
    )

    echo  [OK] Dependencias instaladas.
) else (
    echo  [OK] Dependencias ja instaladas.
)

echo.

REM =====================================================
REM Frontend
REM =====================================================

echo [3/3] Iniciando aplicacao...

cd /d "%PROJECT_ROOT%"

start "Divisor de Compras" cmd /k "cd /d ""%PROJECT_ROOT%"" && npm run dev"

echo  [OK] Frontend iniciado.
echo.

echo ==========================================
echo     APLICACAO INICIADA COM SUCESSO!
echo ==========================================
echo.

timeout /t 2 >nul

exit