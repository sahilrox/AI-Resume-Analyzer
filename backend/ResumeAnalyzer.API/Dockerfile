FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# copy entire backend
COPY . .

# move into API project
WORKDIR /app/ResumeAnalyzer.API

RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

COPY --from=build /app/ResumeAnalyzer.API/out .

ENTRYPOINT ["dotnet", "ResumeAnalyzer.API.dll"]