// @ts-ignore
export default ({ title, description, date, url, thumbnail }) => `
<svg fill="none" width="100%" height="100%" viewBox="0 0 1000 140" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
	<foreignObject width="100%" height="100%">
		<div xmlns="http://www.w3.org/1999/xhtml">
			<style>
				* {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: sans-serif;
				}
        @keyframes gradientBackground {
					0% {
						background-position-x: 0%;
					}
					100% {
						background-position-x: 100%;
					}
				}
				.flex {
					display: flex;
					align-items: center;
          width: 100%;
          height: 100%;
        }
        .outer-container {
          width: 100%;
          height: 100%;
          min-height: 140px;
        }
				.container {
          height: 100%;
          width: 100%;
          border: 1px solid rgba(0,0,0,.2);
          padding: 10px 20px;
          border-radius: 10px;
          background: rgb(255,255,255);
          background: linear-gradient(60deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 47%, rgba(246,246,246,1) 50%, rgba(255,255,255,1) 53%, rgba(255,255,255,1) 100%);
          background-size: 600% 400%;
          animation: gradientBackground 3s ease infinite;
          overflow: hidden;
          text-overflow: ellipsis;
				}
        img {
          margin-right: 10px;
          width: 150px;
          height: 100%;
          min-height: 98px; /* 140px - 2 * 10px padding - 2 * 1px border */
          object-fit: cover;
        }
        .right {
          flex: 1;
          min-width: 0; /* This helps with text overflow */
        }
        a {
          text-decoration: none;
          color: inherit;
        }
        p {
          line-height: 1.5;
          color: #555;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        h3 {
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        small {
          color: #888;
          display: block;
          margin-top: 5px;
          margin-bottom: 8px;
        }
			</style>
      <div class="outer-container flex">
        <a class="container flex" href="${url}" target="__blank">
					<img src="${thumbnail}"/>
          <div class="right">
            <h3>${title}</h3>
            <small>${date}</small>
            <p>${description}</p>
          </div>
				</a>
      </div>
		</div>
	</foreignObject>
</svg>
`;